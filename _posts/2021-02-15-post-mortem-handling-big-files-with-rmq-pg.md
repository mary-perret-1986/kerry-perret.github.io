---
layout: post
title: "Post-mortem: handling big files🗄️ with RabbitMQ🐇 and PostgreSQL🐘"
tags: rabbitmq postgresql concurrency
description: I love it when a plan comes together, but there are times it just doesn't.
---

# TL;DR

Long story short: 90%-out-of-the-blue chance that you just don't.

If you want more details about our story, then feel free to keep reading 👓⬇️.

# Context

A not-so-long-while🦖 ago🦕 we had some alerts📟🔔 in our dedicated Slack Channel💬, triggered every now and then when a particular HangFire job was running:

```
"XXXXXXX DataLoader"
"Production"
Error
2021-01-22 09:04
SpanId: "xxxxxxxxxxxxx"
TraceId: "xxxxxxxxxxxxx"
An unhandled exception occurred during the Hangfire job.
Depth 0: System.AggregateException
One or more errors occurred. (The operation has timed out.)
Depth 1: System.TimeoutException
The operation has timed out.
```

## At first, it was just a RabbitMQ🐇 thingy...

We then looked at our logs in Kibana🔍, just to find out that there was actually an issue related to opening a RabbitMQ Channel📡:
```
System.AggregateException
One or more errors occurred. (The operation has timed out.)
System.AggregateException: One or more errors occurred. (The operation has timed out.)
 ---> System.TimeoutException: The operation has timed out.
   at RabbitMQ.Util.BlockingCell`1.WaitForValue(TimeSpan timeout)
   at RabbitMQ.Client.Impl.SimpleBlockingRpcContinuation.GetReply(TimeSpan timeout)
   at RabbitMQ.Client.Impl.ModelBase.ModelRpc(MethodBase method, ContentHeaderBase header, Byte[] body)
   at RabbitMQ.Client.Framing.Impl.Model._Private_ChannelOpen(String outOfBand)
   at RabbitMQ.Client.Framing.Impl.AutorecoveringConnection.CreateNonRecoveringModel()
   at RabbitMQ.Client.Framing.Impl.AutorecoveringConnection.CreateModel()
[...]
```

Googling🔍 around🗺️ didn't yield too many results at first, even if we found a bunch of (remotely) related issues on GitHub🗃️:
- [Time out exception on CreateModel in high volume scenario](https://github.com/rabbitmq/rabbitmq-dotnet-client/issues/945)
- [Using blocking publisher confirms with concurrent publishers](https://github.com/rabbitmq/rabbitmq-dotnet-client/issues/959)
- [Opening a channel inside a consumer interface callback times out waiting for continuation](https://github.com/rabbitmq/rabbitmq-dotnet-client/issues/650)
- [Timeout exception when trying to declare a queue (or exchange)](https://github.com/rabbitmq/rabbitmq-dotnet-client/issues/310)

## The Process🏃‍♀️

Since there wasn't really a clear solution out of our prelimenary investigations, it was time to step back and see a slightly bigger picture about what the Hangfire job was doing overall:
1. Request data from an API💱
2. Create groups🏘️ based on some predicates
3. Process the groups as commands in our PostgreSQL-based🐘 event store and then persist💾 the newly decided/generated events
4. Publish💾 the events to RabbitMQ🐇

## Oopsie... seems like PostgreSQL🐘 is also failing❌!

Truth to be told🧙‍♀️, there was also an issue occuring during the PostgreSQL persistence step as well🔎:

```
An unhandled exception has occurred while executing the request.
System.AggregateException: One or more errors occurred. (One or more errors occurred. (One or more errors occurred. (One or m
ore errors occurred. (Exception while reading from stream))))
 ---> System.AggregateException: One or more errors occurred. (One or more errors occurred. (One or more errors occurred. (Ex
ception while reading from stream)))
 ---> System.AggregateException: One or more errors occurred. (One or more errors occurred. (Exception while reading from str
eam))
 ---> System.AggregateException: One or more errors occurred. (Exception while reading from stream)
 ---> Npgsql.NpgsqlException (0x80004005): Exception while reading from stream
 ---> System.TimeoutException: Timeout during reading attempt
```

## RabbitMQ + Multithreading: A Love Story

Another pesty little detail🦠, is that we tried to speed up⏩ the RabbitMQ publishing process using [`PSeq`](http://fsprojects.github.io/FSharp.Collections.ParallelSeq) and the [PublishBatch API of the official RabbitMQ .NET client](https://github.com/rabbitmq/rabbitmq-dotnet-client/blob/master/projects/RabbitMQ.Client/client/impl/BasicPublishBatch.cs#L38). 

The thing you see, is that during our first iteration🧗‍♀️ when implementing this service (and more generally-speaking when we were implementing the RabbitMQ support in our codebase), we already have experienced issues while experimenting with [`IModel`](https://github.com/rabbitmq/rabbitmq-dotnet-client/blob/master/projects/RabbitMQ.Client/client/api/IModel.cs/#L48) in a concurrent fashion (i.e. multithreading) which obviously turned out to be a rather infamously well-known concern👩‍🎤. So much, that there is in fact, [a section of the official RabbitMQ dedicated about it](https://www.rabbitmq.com/dotnet-api-guide.html#concurrency-channel-sharing):

> As a rule of thumb, `IModel` instance usage by more than one thread simultaneously should be avoided. Application code should maintain a clear notion of thread ownership for `IModel` instances.

So here is the catch, we were not using EasyNetQ, or any abstraction layer on top of [the official RabbitMQ .NET client](https://github.com/rabbitmq/rabbitmq-dotnet-client), and something like the management of a single instance of `IModel` per thread was suboptimal to put it mildly, i.e. we were creating a new `IModel` instance everytime we needed to send a batch of messages wich at some point started to create a bottleneck (i.e. several instantiations per thread🧵). 

Tbf, it was already a source of struggles🏋️‍♀️, actually we've noticed that our implementation was much slower🐌 at sending messages than the EasyNetQ abstraction... and one of the reasons was the way EasyNetQ achieved this one single `IModel` instance per thread policy, in essence the number of `IModel` instances is kept to a bare minimum. Some of the important building blocks are listed below:
- [`AsyncLock`](https://github.com/EasyNetQ/EasyNetQ/blob/develop/Source/EasyNetQ/Internals/AsyncLock.cs)
- [`RabbitAdvancedBus`](https://github.com/EasyNetQ/EasyNetQ/blob/521589682b76123b0c409086c5afe86f7659871b/Source/EasyNetQ/RabbitAdvancedBus.cs#L335)
- [`PersistentChannel`](https://github.com/EasyNetQ/EasyNetQ/blob/develop/Source/EasyNetQ/Producer/PersistentChannel.cs)

Anyway, my colleague [Yazide Boujlil](https://www.linkedin.com/in/yazideboujlil/) managed to come up with the explanations below:

> For each client connection, we have a socket which is shared between the threads via a [`.NET Channel`](https://docs.microsoft.com/en-us/dotnet/api/system.threading.channels.channel) that acts as some sort of buffer. Several threads can write to it, but only a single thread will read what is there and therefore will eventually write data to the relevant socket.
> 
> The RMQ channels (`IModel`) are merely the byproducts🐤 of the RMQ connection. Each message which passes through the socket contains the ID of the channel to which it is attached. To declare a channel you need a small blocking RPC upon which we have experienced our annoying timeouts⏰.
> 
> Now it turns out that the server can actually put connections🔌 that publish too quickly🚅 (compared to consumers) in flow control mode, i.e. aka on hold, like putting them on ice🧊, and block and unblock the connection to limit the flow of messages🚧.
>
> Now what is happening, in my opinion, is that we ended up in a situation where we overload both the server and the client. The server goes into a flow control mode which does not allow the client to empty its buffer and therefore any new channel creation is blocked until the cache is cleared. As there is a timeout on the channel creation, eventually the shit hit the fan.
>

We naively thought that using the good old👵 [`ThreadLocal<'T>`](https://docs.microsoft.com/en-us/dotnet/api/system.threading.threadlocal-1) was the simplest and easiest way to go to keep this one `IModel` instance per thread.

Anyhoo, we kept investigating🔬 to tackle this `IModel` issue in a concurrent context, and found a few articles (two of the links below were written by [Mike Hadlow](https://twitter.com/mikehadlow), the author of the [EasyNetQ](https://easynetq.com) library):

- [Very high latency for GC when using (loads of) `ThreadLocal`](https://github.com/dotnet/runtime/issues/2382)
- [EasyNetQ: A Breaking Change, `IPublishChannel`](https://dzone.com/articles/easynetq-breaking-change)
- [How Do I Detect When a Client Thread Exits?](https://stackoverflow.com/questions/10432494/how-do-i-detect-when-a-client-thread-exits)

The point made by Mike👇:

> Initially I'd hoped to hide channels from EasyNetQ users🙈. With subscriptions this makes sense - after the client creates a subscription, EasyNetQ looks after the channel and the subscription consuming thread. But publishing turned out to be more complex. Channels cannot be shared between threads, so EasyNetQ initially used a `ThreadLocal` channel for all publish calls☎️. A new thread meant a new channel🌄.
>
> This problem manifested itself with a nasty operational bug we suffered. We had a service which woke up on a timer, created some threads, and published messages on them. **Although the threads ended, the channels didn't close📭, and each timer interval🕰️ added another few open channels**. 

So ok... it seems that just relying on the vanilla edition of `ThreadLocal<'T>`🍨 might not do, mostly cause this concurrency primitive does not handle the exiting thread scenario.

Fair enough, we kept googling🔎 and found these two little gems💎 drafted by Ayende👨‍🏫:

- [The slow slowdown of large systems](https://ayende.com/blog/189761-A/production-postmortem-the-slow-slowdown-of-large-systems)
- [The design and implementation of a better `ThreadLocal<T>`](https://ayende.com/blog/189793-A/the-design-and-implementation-of-a-better-threadlocal-t)

As well this library📚:
- [UnmanagedThreadUtils](https://github.com/ptupitsyn/UnmanagedThreadUtils)

We started to draft our own implementation of `ThreadLocal<'T>` supporting the thread exiting scenario when carrying a `IDisposable` resource, a bit like what is described in [this SO answer](https://stackoverflow.com/a/7670762/4636721).

## "It works... but not on my machine!"👩‍💻(the usual Kerry)

At this stage, we were fairly confident that we had a working solution to solve our initial problem. But spoiler alert: we did not and we were once again prooved all wrong🙅‍♀️, once again. While we were reviewing our new solution before shipping it to our integration environment, we quickly realized that there was something off when using a sizable amount of data. In fact, I still kept having timeouts⏰ while my other colleagues did not. We were all testing using the same codebase and the same Docker configuration🐋... so by all accounts we were supposed to get the same results and... and we were all wondering "How is that even possible?"

## "Hey Cap'👩‍✈️, looks like it's related to your hardware"

Fair enough, yes, my laptop💻 is infamously slow when compared to the machines🖥️ of my teammates.

It didn't take us too long to realize that given different pieces of hardware (RAM, CPU) accessed (i.e. limited) either thru a VM or a Docker Container🐳 mean they still can have vastly different performances. It's then easy to understand that the underlying hardware powering this or that bit of infra is likely to improve or worsen the capability to support a bigger number of concurrent writers. If your hardware falls short, it's very likely that you're going to have a lock-bottleneck at some point.

## Better Parallelism, an attempt

One way to tackle the overall concurrency per layer of infra was to adjust using the TPL [DataFlow - TPL](https://docs.microsoft.com/en-us/dotnet/standard/parallel-programming/dataflow-task-parallel-library). It goes without saying that different environment had different infra constraints.

## "Btw, if it's really just a timeout problem, can't you just increase the value of the so-called timeout?"

Yes and we did on multiple occasions. Also one more thing, it wasn't just about a Hangfire job, we also have an admin api so-to-speak to restart the job we mentioned early on and it was expected to run within 5 minutes (or as fast as possible). The thing is that it wasn't just a timeout thing, or even just about parallelism and what we already listed above, cause...

## Big File💾 (You Are Beautiful🌅)

... basically here is the deal, we needed to juggled with all these intertwined bits of parameters:
- PostgreSQL: Timeout (we want that as fast as possible)⏰
- RabbitMQ: Timeout (same as above)⏰
- RabbitMQ: Single `IModel` per Thread policy👮‍♀️
- Maximum degree of parallelism per "IO layer" 🔀
- The respective bits of hardware / VM / Docker containers supporting a given service and relevant bits of infrastructure dependencies💪

The overall problem looked like a Gordian knot🧶 until we realized that we could bypass it altogether with a different approach... when we started to a have closer look at... well... the files💾 and more precisely, their average size.

In retrospect, persisting "relatively big files" 100MB either to a JSONB column🧮 or to RabbitMQ (tho for the RabbitMQ part there were first split based on some business conditions) wasn't really the best option available out there... performance-wise🐢.

# Solution

Given all the information above, it became crystal clear🔮 that the main hiccup was to persist files where they were not really supposed to be persisted... so we decided to use... 

## ("a" Corporate[i.e. on-premise]) S3

Our first and original "sin"🛐 was purely architectural📐. Removing the file persistence💾 from PostgreSQL and RabbitMQ "duties" and hence keeping just a reference(i.e. ID) to the file in the S3 bucket💿 did alleviate a lot the IO burden by several orders of magnitude.

What we have done is essentially delegating⏏️ the infra burden to another service that is good at handling file persistence and "voila"🍷🥖.

Note: I didn't mention it when I first drafted this article, but if you consider that several instances of the same service are running simulatenously and given that the even store is a very central building block in our architecture it makes sense to NOT burden it with long concurrent writes.

## EasyNetQ

This issue (and the investigations we did around this issue) made us realize another problem. When we started to use RabbitMQ in our project we thought we would need a certain granularity hence the decision to pick the rather low-level RabbitMQ .NET official client...

We had this premise, because in our past experience with Entity Framework🧰, the overly complex abstraction made us litterally miserable😿 and we were spending (i.e. wasting?) more time fighting⚔️ the framework than benefiting from it (i.e. you deliver less business-value).

But keep in mind that the opposite is also true (i.e. afaik, these days, the vast majority of the software developers on Earth aren't coding in assembly). There is a middle-ground, but it changes over time, due to skills, deadlines, priorities, and so forth. 

So... I hate to break it to you dear reader... but contrary to the popular belief🌎 that "it's always better to have a close-to-the-metal🔧 implementation that you can gradually customize and tune accordingly to your very needs" (and illustrated in articles like [this one](https://www.ouarzy.com/2020/12/27/dont-reinvent-the-wheel), or [that one](https://www.ouarzy.com/2019/09/29/writing-code-isnt-the-bottleneck)), it seems that well it's not always that "straightforward" to figure out who or more exactly what is actually doing the heavy lifting.

Maintaining our messaging implementation✉️ with the official RabbitMQ .NET client with all its caveats had a cost and it became increasingly expensive to keep up with all the new features and the ones that are going to be released. 

The value💰 we bring to our project is not measured by the time we spent on tweaking the official RabbitMQ .NET client by doing the heavy lifting ourselves but rather by providing business-value to our stakeholders and end-users. 

# "It's all your f*cking fault!" or "Amateur-hour, Admit it! You just made a monumental mistake!"

It could be very tempting to draw this kind of conclusion, but the truth is "nope", nawt really, sorry pal, I do mean it.

Fun facts:

1. We actually even had a branch with the S3 solution ready to be merged a few months ago📅, but we didn't know business priorities would change that much over time and the priority was given to other more important topics🤑.
2. We started with EasyNetQ back in the day, but the configuration system wasn't too appealing and we were afraid that we would have been stuck with this lib at some point, i.e. a situation similar to a vendor lock-in🔒.

_The Cheesy🧀-Corny🍿 Moment⌛ (also known as The Emotional Kerry Moment🤸‍♀️, but let's just pretend it's actually wholesome🧸)._

You can always regret that you haven't done enough. But here are my cheap 2 cents👛: it's pointless. You can't know everything in advance and making wild guesses about the future doesn't seem like a reasonable option either. **You learn what you can learn from something that didn't pan out as good as you expected it to be, but it doesn't mean that the decisions you made back then were all just plain wrong**. 

**Your decision process is just as contextual as the constraints involved when you were making those very same decisions at a given time📆. It is unproductive to place the blame on a context, I would even go as far as to say that blaming is probably the thing we should all probably refrain ourselves from doing. Instead we would all be much better off focusing on finding solutions and actionable tasks to solve our problems rather than just getting pissed at the circumstances and going round in circles.**. 

> The devil😈 is in the details.

{% include youtube-player.html id="NsUFBm1uENs" %}