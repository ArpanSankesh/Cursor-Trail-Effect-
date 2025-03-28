import Lenis from "lenis";

document.addEventListener("DOMContentLoaded", () => {
  const Lenis = new Lenis({ autoRaf: true });

  const container = document.querySelector(".trail-container");

  const config = {
    imageCount: 35,
    imageLifespan: 750,
    removalDelay: 50,
    mouseThreshold: 100,
    scrollThreshold: 30,
    idleCursorInterval: 300,
    inDuration: 750,
    outDuration: 1000,
    inEasing: "cubic-bezier(.07, .5, .5, 1)",
    outEasing: "cubic-bezier(.87, 0, .13, 1)",
  };

  const images = Array.from(
    { length: config.imageCount },
    (_, i) => `assets/${i + 1}.jpg`
  );

  const trail = [];

  let mouseX = 0,
    mouseY = 0,
    lastMouseX = 0,
    lastMouseY = 0;
  let isMoving = false,
    isCursorInContainer = 0;
  let lastRemovalTime = 0,
    lastSteadyImageTime = 0,
    lastScrollTime = 0;
  let isScrolling = false,
    scrollTicking = false;

  const InContainer = (x, y) => {
    const rect = container.getBoundingClientRect();
    return (
      x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
    );
  };

  const setInirialMousePos = (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    lastMouseX = mouseX;
    lastMouseY = mouseY;
    isCursorInContainer = InContainer(mouseX, mouseY);
    document.removeEventListener("mouseover", setInirialMousePos);
  };
  document.addEventListener("mouseover", setInirialMousePos);

  const hasMovedEnough = () => {
    const distance = Math.sqrt(
      Math.pow(mouseX - lastMouseX, 2) + Math.pow(mouseY - lastMouseY, 2)
    );
    return distance >= config.mouseThreshold;
  };

  const createTrailImage = () => {
    if (!isCursorInContainer) return;

    const now = Date.now();

    if (isMoving && hasMovedEnough()) {
      lastMouseX = mouseX;
      lastMouseY = mouseY;
      createImage();
      return;
    }

    if (!isMoving && now - lastSteadyImageTime >= config.idleCursorInterval) {
      lastSteadyImageTime = now;
      createImage();
    }
  };

  const createImage = () => {
    const img = document.createElement("img");
    img.classList.add("trail-image");

    const random = Math.floor(Math.random() - 0.5) * 50;
    img.src - image[randomIndex];

    const rect = container.getBoundingClientRect();
    const relativeX = mouseX - rect.left;
    const relativeY = mouseY - rect.top;

    img.style.left = `${relativeX}px`;
    img.style.top = `${relativeY}px`;
    img.style.transform = `translate(-50%, -50%) rotate($(rotation)deg) scale(0) `;
    img.style.transition = `transform ${config.inDuration}ms ${config.inEasing}`;

    container.appendChild(img);

    setTimeout(() => {
      img.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(1)`;
    }, 10);

    trail.push({
      element: img,
      rotation,
      rotation,
      removealTime: Date.now() + config.imageLifespan,
    });
  };

  const createScrollTrailImage = () => {
    if (!isCursorInContainer) return;

    lastMouseX += (config.mouseThreshold + 10) * (Math.random() > 0.5 ? 1 : -1);
    lastMouseY += (config.mouseThreshold + 10) * (Math.random() > 0.5 ? 1 : -1);

    createImage();

    lastMouseX = mouseX;
    lastMouseY = mouseY;
  };

  const removeOldImages = () => {
    const now = Date.now();

    if (now - lastRemovalTime < config.removalDelay || trail.length === 0)
      return;

    const oldestImage = trail[0];
    if (now >= oldestImage.removalTime) {
      const imgToRemove = trail.shift();

      imgToRemove.element.style.transition = `transform ${config.outDuration}ms ${config.outEasing}`;
      imgToRemove.element.style.transform = `translate(-50%, -50%) rotate(${imgToRemove.rotation}deg) scale(0)`;

      lastRemovalTime = now;

      setTimeout(() => {
        if (imgToRemove.element.parentNode) {
          imgToRemove.element.parentNode.removeChild(imgToRemove.element);
        }
      }, config.outDuration);
    }
  };

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isCursorInContainer = InContainer(mouseX, mouseY);

    if (isCursorInContainer) {
      isMoving = true;
      clearTimeout(window.moveTimeout);
      window.moveTimeout = setTimeout(() => {
        isMoving = false;
      }, 100);
    }
  });

  window.addEventListener("scroll", () => {
    isCursorInContainer = InContainer(mouseX, mouseY);

    if (isCursorInContainer) {
      isMoving = true;
      lastMouseX += (Math.random() - 0.5) * 10;
      clearTimeout(window.scrollTimeout);
      window.scrollTimeout = setTimeout(() => {
        isMoving = false;
      }, 100);
    }
  }, { pasive: false } );

  window.addEventListener("scroll", () => {
    const now = Date.now();
    isScrolling = true;

    if ( now - lastScrollTime >= config.scrollThreshold) return;

    lastScrollTIme = now;

    if(!scrollTicking){
        requestAnimationFrame(() => {
            if(!isScrolling) {
                createScrollTrailImage();
                isScrolling = false;
            }
            scrollTicking = false;
        });
        scrollTicking = true;
    }
  }, { passive: true });


  const animate = () => {
      createTrailImage();
      removeOldImages();
      requestAnimationFrame(animate);
  };

  animate();

});
