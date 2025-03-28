import Lenis from 'lenis';

document.addEventListener('DOMContentLoaded', () => {
    const Lenis = new Lenis({ autoRaf : true });

    const container = document.querySelector('.trail-container');

    const config = {
        imageCount : 35, 
        imageLifespan : 750,
        removalDelay : 50,
        mouseThreshold : 100,
        scrollThreshold : 30,
        idleCursorInterval : 300,
        inDuration : 750,
        outDuration : 1000,
        inEasing: "cubic-bezier(.07, .5, .5, 1)",
        outEasing: "cubic-bezier(.87, 0, .13, 1)",
    };
});

