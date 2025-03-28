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

    const images = Array.from(
        { length: config.imageCount }, 
        (_, i) => `assets/${i + 1}.jpg`
    );

    const trail = [];

    let mouseX = 0, mouseY = 0, lastMouseX = 0, lastMouseY = 0;
    let isMoving = false, isCursorInContainer = 0;
    let lastRemovalTime = 0, lastSteadyImageTime = 0, lastScrollTime = 0;
    let isScrolling = false, scrollTicking = false;

    const InContainer = (x, y) => {
        const rect = container.getBoundingClientRect();
        return ( x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom);
    }

    const setInirialMousePos = (event) => {
        mouseX = event.clientX;
        mouseY= event.clientY;
        lastMouseX = mouseX;
        lastMouseY = mouseY;
        isCursorInContainer = InContainer(mouseX, mouseY);
        document.removeEventListener("mouseover", setInirialMousePos);
    }
    document.addEventListener("mouseover", setInirialMousePos);

const hasMovedEnough = () => {
    const distance = Math.sqrt(Math.pow(mouseX - lastMouseX, 2) + Math.pow(mouseY - lastMouseY,2)  );
    return distance >= config.mouseThreshold;
}

const createTrailImage = () => {
    if(!isCursorInContainer) return;

    const now = Date.now();

    if(isMoving && hasMovedEnough()) {
      lastMouseX = mouseX;
      lastMouseY = mouseY;
      createImage();
      return;
    }

    if(!isMoving && now - lastSteadyImageTime >= config.idleCursorInterval) {
        lastSteadyImageTime= now;
      createImage();
    }
}

const createImage = () => {
    const img = document.createElement("img");
    img.classList.add("trail-image");
    
    const random = Math.floor(Math.random() - 0.5) *50;
    img.src - image[randomIndex];

    const rect = container.getBoundingClientRect();
    const relativeX = mouseX - rect.left;
    const relativeY = mouseY - rect.top;

    img.style.left = `${relativeX}px`;  
    img.style.top = `${relativeY}px`;
    img.style.transform = `translate(-50%, -50%) rotate($(rotation)deg) scale(0) `;
    img.style.transition = `transform ${config.inDuration}ms ${config.inEasing}`;

    container.appendChild(img);
}
});
