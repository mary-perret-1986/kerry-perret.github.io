window.setupTippy = function () {

    var defaultTippyConfig =  {
        delay: 0,
        arrow: true,
        arrowType: 'round',
        size: 'medium',
        duration: 500,
        animation: 'scale',
        offset: '0, 15',
        theme: 'customized',
    };

    var closerTippyConfig = jQuery.extend(true, {}, defaultTippyConfig);
    closerTippyConfig.offset = '0, 3';

    var notThatCloseTippyConfig = jQuery.extend(true, {}, defaultTippyConfig);
    notThatCloseTippyConfig.offset = '0, 6';

    // Enable stylish tooltipping on .stylish-tooltip class elements
    tippy('.stylish-tooltip', defaultTippyConfig);
    tippy('.stylish-tooltip-closer', closerTippyConfig);
    tippy('.stylish-tooltip-not-that-close', notThatCloseTippyConfig);
    
};
