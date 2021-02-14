window.setupPageProgressBar = function(progressBarLocation, contentToTrack) {

    if(!$(contentToTrack).length) {
        return;
    }

    // Create the container div
    var $progressContElement = $("<div id='progress-cont'></div>");

    // Create the progress bar itself
    var $progressBarElement = $("<div id='progress-bar'></div>");
    $progressBarElement.css("width", "0%");

    $progressContElement.append($progressBarElement);
    
    var $locationObject = $(progressBarLocation);
    $locationObject.prepend($progressContElement);
    
    // Event handler that updates the width of the progress bar based
    // on how far the contentToTrack elemt has been scrolled
    function updateProgressBar() {

        var height = $(document).height() - $(window).innerHeight();
        var percentage = Math.max(0, Math.min(1, $(window).scrollTop() / height));

        $progressBarElement.css("width", percentage * 100 + "%");
    }

    $(window).on("scroll touchmove", updateProgressBar); 

    updateProgressBar();
};
