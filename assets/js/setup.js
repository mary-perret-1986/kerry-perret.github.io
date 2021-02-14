$(function(){ 
    // Right o' wrong...
    // $('body').niceScroll();
    console.info("-- I'm not a Front-End Developer! --");
    window.setupBackToTopButton();
    window.setupPageProgressBar('#header', '#post');

    if (!window.isMobileOrTablet()) {
        window.setupTippy();
        window.setupNProgress();
    }
    
});
