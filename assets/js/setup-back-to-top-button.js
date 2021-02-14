window.setupBackToTopButton = function () {
    
    function updateBackToTopButton() {
        if ($(window).scrollTop() > 50) { 
            $('#back-to-top-button').fadeIn();
        } else { 
            $('#back-to-top-button').fadeOut();
        } 
    }

    $(window).on('scroll touchmove', updateBackToTopButton); 

    updateBackToTopButton();

    function onBackToTopButtonClick() {
        $('html, body').animate({ scrollTop: 0 }, 500); 
        return false; 
    }

    $('#back-to-top-button').on('click touchstart', onBackToTopButtonClick);
};
