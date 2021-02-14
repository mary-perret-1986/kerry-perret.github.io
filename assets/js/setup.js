$(function(){ 
    // Right o' wrong...
    // $('body').niceScroll();

    window.setupBackToTopButton();
    window.setupPageProgressBar('#header', '#post');

    if (!window.isMobileOrTablet()) {
        window.setupTippy();
        window.setupNProgress();
    }
    
});
