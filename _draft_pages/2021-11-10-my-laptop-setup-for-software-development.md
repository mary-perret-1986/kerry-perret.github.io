---
layout: post
title: "My Setup for Software Development"
tags: laptop microsoft linux windows11 setup software development
description: How I set up my laptop to work with Windows 11
---

# Hardware

## Laptop

```fsharp
let example = 32
```

My daily driver is the laptop provided by [the company I am working for](https://www.veepee.fr), on which I do have admin rights and I can set up whatever operating system to get my job done, as long as it is within the local legal framework. 

The laptop is a [Dell Inc. Precision 5550](https://www.dell.com/en-us/work/shop/dell-laptops-and-notebooks/precision-5550-workstation/spd/precision-15-5550-laptop); I've specifically asked my company to give me [QWERTY layout](https://en.wikipedia.org/wiki/QWERTY) cause I've never bother myself to learn to work with the [local French AZERTY keyboard layout](https://en.wikipedia.org/wiki/AZERTY). Though, in all honesty, my laptop doesn't travel much so, I'm just using the keyboard connected to the docking station 99% of the time.

[Neofetch](https://github.com/dylanaraps/neofetch) showing me:

```
        ,.=:!!t3Z3z.,                  natalie-perret-1986@nppc
       :tt:::tt333EE3                  ------------------------
       Et:::ztt33EEEL @Ee.,      ..,   OS: Windows 11 Pro x86_64
      ;tt:::tt333EE7 ;EEEEEEttttt33#   Host: Dell Inc. Precision 5550
     :Et:::zt333EEQ. $EEEEEttttt33QL   Kernel: 10.0.22000
     it::::tt333EEF @EEEEEEttttt33F    Uptime: 9 days, 41 mins
    ;3=*^```"*4EEV :EEEEEEttttt33@.    Packages: 2 (scoop)
    ,.=::::!t=., ` @EEEEEEtttz33QF     Shell: bash 4.4.23
   ;::::::::zt33)   "4EEEtttji3P*      Resolution: 1920x1080
  :t::::::::tt33.:Z3z..  `` ,..g.      DE: Aero
  i::::::::zt33F AEEEtttt::::ztF       WM: Explorer
 ;:::::::::t33V ;EEEttttt::::t3        WM Theme: Custom
 E::::::::zt33L @EEEtttt::::z3F        Terminal: Windows Terminal
{3=*^```"*4E3) ;EEEtttt:::::tZ`        CPU: Intel i7-10850H (12) @ 2.720GHz
             ` :EEEEtttt::::z7         GPU: Caption
                 "VEzjt:;;z>*`         GPU: Intel(R) UHD Graphics
                                       GPU: NVIDIA Quadro T1000
                                       GPU
                                       Memory: 19817MiB / 32509MiB
```

- Screens: 2 x [Dell P2419H 24 Inch, LED-Backlit, Anti-Glare, 8 ms](https://www.amazon.com/Dell-Screen-LED-Lit-Monitor-P2419H/dp/B07F8XZN69)
- Dock: 
- Keyboard: [Keychron K1 87 Key Ultra-Thin Wired TKL - Low Profile Brown Keys](https://www.amazon.com/gp/product/B07YJV1C15)
- Mouse: [Logitech G403 Hero Wired](https://www.amazon.com/Logitech-Backlit-Adjustable-Weights-Programmable/dp/B07SCMTKGB)
- Camera: [Logitech C930e](https://www.amazon.com/Logitech-C930e-1080P-Video-Webcam/dp/B00CRJWW2G)
- Microphone: [Rode NT-USB, Studio-Quality USB Cardioid Condenser](https://www.amazon.com/Rode-NT-USB-Versatile-Studio-Quality-Microphone/dp/B00KQPGRRE)
- Headphone: [Sony WH-1000XM4, Wireless, Noise Canceling Overhead Headphones](https://www.amazon.com/Sony-WH-1000XM4-Canceling-Headphones-phone-call/dp/B0863FR3S9)

## (IKEA) Desktop

- [RODULF - Desk sit/stand, grey 140x80 cm](https://www.ikea.com/ch/en/p/rodulf-desk-sit-stand-grey-white-s99326170)
- [ALEFJÄLL - Office chair, Glose black](https://www.ikea.com/ch/en/p/alefjaell-office-chair-glose-black-70367458)

# Software

## Operating System-s-ish

### Windows 11🪟

### Windows Terminal Configuration

#### PowerShell Configuration

#### Ubuntu 20.04.3 LTS WSL Configuration

### Package Managers📦

#### [Chocolatey](https://chocolatey.org)🍫

Listing the Chocolatey packages using `choco list --local-only`, here is what I have currently on my laptop:

```
audacity 3.0.5
brave 1.30.89
cascadia-code-nerd-font 2.1.0
cascadiacode 2108.26
chocolateygui 0.19.0
discord 1.0.9003
discord.install 1.0.9003
docker-desktop 4.1.0
dotnet-5.0-runtime 5.0.10
dotnet-5.0-sdk 5.0.401
dotnet-5.0-sdk-4xx 5.0.401
DotNet4.5.2 4.5.2.20140902
dotnet4.7.2 4.7.2.20210903
dotnetfx 4.8.0.20190930
Firefox 93.0.0.20211011
flameshot 0.10.1
git 2.33.0.2
git.install 2.33.0.2
google-drive-file-stream 51.0.14.0
GoogleChrome 94.0.4606.81
hexchat 2.14.3
insomnia-rest-api-client 2021.5.3
jetbrainstoolbox 1.21.9712
KB2533623 2.0.0
KB2919355 1.0.20160915
KB2919442 1.0.20160915
KB2999226 1.0.20181019
KB3033929 1.0.5
KB3035131 1.0.3
KB3063858 1.0.0
kubernetes-cli 1.22.2
kubernetes-helm 3.7.0
libreoffice-fresh 7.2.1
litedb-studio 1.0.2
mRemoteNG 1.76.20.24615
msys2 20210604.0.0
nerdfont-hack 2.1.0
netfx-4.7.1 4.7.1.0
netfx-4.7.1-devpack 4.7.2558.20210905
netfx-4.7.2 4.7.2.0
netfx-4.7.2-devpack 4.7.2.20210903
netfx-4.8 4.8.0.20190930
netfx-4.8-devpack 4.8.0.20190930
nodejs.install 16.11.0
obs-studio 27.1.3
obs-studio.install 27.1.3
Opera 80.0.4170.16
PDFXchangeEditor 9.1.356.20210806
postman 9.0.5
ruby 3.0.2.1
rufus 3.16
s3browser 10.0.9
signal 5.20.0
skype 8.77.0.97
slack 4.20.0
sqlite-studio.portable 3.3.3
sqlitestudio 3.3.3
steam-client 2.10.91.91
sumatrapdf 3.3.3
sumatrapdf.install 3.3.3.20210920
telegram 3.1.8
telegram.install 3.1.8
tor-browser 10.5.10
ubuntu.font 0.83
vcredist140 14.29.30135
vcredist2015 14.0.24215.20170201
vcredist2017 14.16.27033
vlc 3.0.16
vscode 1.61.0
vscode.install 1.61.0
webex-meetings 41.10.3.19
windirstat 1.1.2.20161210
wsl2 2.0.0.20210721
```

#### Backup Plan: [Scoop](https://scoop.sh)🍨

### Software Development

- Jetbrains IDEs using their [toolbox](https://www.jetbrains.com/toolbox-app)
  - .NET F# + C#: [Rider](https://www.jetbrains.com/rider)
  - Database: [DataGrip](https://www.jetbrains.com/datagrip)
  - Python: [Pycharm](https://www.jetbrains.com/pycharm)
  - Rust: [CLion](https://www.jetbrains.com/clion)
  - Go: [Goland](https://www.jetbrains.com/goland)
  - Scala / Kotlin: [IntelliJ](https://www.jetbrains.com/idea)
- Visual Studio Code: [Visual Studio Code](https://github.com/microsoft/vscode)
- Remote Desktop Accesss: [mRemoteNG](https://github.com/mRemoteNG/mRemoteNG)
- API Client: [Insomnia](https://insomnia.rest)
- Screenshots: [Flameshot](https://github.com/flameshot-org/flameshot)
- Terminal: [Windows Terminal](https://github.com/microsoft/terminal)

#### Jetbrains Plugins

- [GitHub Copilot](https://plugins.jetbrains.com/plugin/17718-github-copilot)
- [Gruvbox Theme](https://plugins.jetbrains.com/plugin/12310-gruvbox-theme)

#### Visual Studio Extensions

### So am I no longer fancying linux🐧?

Not sure I ever have to begin with.

### Ubuntu WSL at the rescue!

At the time of writing, I am using Ubuntu 20.04.3 LTS.

```
            .-/+oossssoo+/-.               natalie-perret-1986@nppc
        `:+ssssssssssssssssss+:`           ------------------------
      -+ssssssssssssssssssyyssss+-         OS: Ubuntu 20.04.3 LTS on Windows 10 x86_64
    .ossssssssssssssssssdMMMNysssso.       Kernel: 5.10.16.3-microsoft-standard-WSL2
   /ssssssssssshdmmNNmmyNMMMMhssssss/      Uptime: 5 days, 12 hours, 54 mins
  +ssssssssshmydMMMMMMMNddddyssssssss+     Packages: 681 (dpkg)
 /sssssssshNMMMyhhyyyyhmNMMMNhssssssss/    Shell: bash 5.0.17
.ssssssssdMMMNhsssssssssshNMMMdssssssss.   Terminal: /dev/pts/0
+sssshhhyNMMNyssssssssssssyNMMMysssssss+   CPU: Intel i7-10850H (12) @ 2.712GHz
ossyNMMMNyMMhsssssssssssssshmmmhssssssso   GPU: 514f:00:00.0 Microsoft Corporation Device 008e
ossyNMMMNyMMhsssssssssssssshmmmhssssssso   Memory: 126MiB / 15879MiB
+sssshhhyNMMNyssssssssssssyNMMMysssssss+
.ssssssssdMMMNhsssssssssshNMMMdssssssss.
 /sssssssshNMMMyhhyyyyhdNMMMNhssssssss/
  +sssssssssdmydMMMMMMMMddddyssssssss+
   /ssssssssssshdmNNNNmyNMMMMhssssss/
    .ossssssssssssssssssdMMMNysssso.
      -+sssssssssssssssssyyyssss+-
        `:+ssssssssssssssssss+:`
            .-/+oossssoo+/-.
```



Listing the Scoop packages currently install on my laptop using `scoop list`, here is what I'm getting:

```
neofetch 7.1.0 [main]
```