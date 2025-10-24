document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    const desktop = document.getElementById('desktop');
    const restartDesktopIcon = document.getElementById('restartDesktopIcon');
    const currentTimeSpan = document.getElementById('currentTime');

    let loaderTimeout;

    //updates the current time in the system tray.
    function updateTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        currentTimeSpan.textContent = `${hours}:${minutes}`;
    }


    //resets and starts the loader animation.
    //hides the desktop and sets a timeout for the loader to fade out.

    function showLoader() {
        desktop.classList.add('hidden');
        loader.classList.remove('hidden', 'fade-out');

        // force reflow to restart CSS animations
        loader.style.animation = 'none';
        void loader.offsetWidth; // trigger reflow
        loader.style.animation = ''; // re-enable animation-- inherits from CSS)

        // restart animations for nested elements if they have their own animations
        loader.querySelectorAll('.bg, .circle').forEach(el => {
            el.style.animation = 'none';
            void el.offsetWidth; // trigger reflow
            el.style.animation = ''; // re-enable animation
        });

        // set timeout for 5 seconds to start the fade-out
        loaderTimeout = setTimeout(() => {
  loader.classList.add('fade-out');
  loader.addEventListener('transitionend', handleFadeOutEnd, { once: true });
}, 5000);
    }


     //handles the end of the loader's fade-out transition.
     //hides the loader completely and shows the desktop.

    function handleFadeOutEnd() {
        loader.classList.add('hidden'); // fully hide loader (display: none)
        desktop.classList.remove('hidden'); // show desktop
        // remove the event listener to prevent multiple calls
        loader.removeEventListener('transitionend', handleFadeOutEnd);
    }


    //restarts the entire process: clears existing timeouts and shows the loader again.

    function restart() {
        clearTimeout(loaderTimeout); // clear any pending fade-out timeout
        showLoader(); // start the loader animation again
    }

    // add event listener to the restart desktop icon
    if (restartDesktopIcon) {
        restartDesktopIcon.addEventListener('click', restart);
    }

    // initial call to show the loader when the page loads
    showLoader();

    // update time every minute
    updateTime(); // Initial call
    setInterval(updateTime, 60000);

    //draggable graph pop up
    const thisPcIcon = document.getElementById('thisPcIcon');
    const graphContainer = document.getElementById('graphContainer');
    const graphHeader = document.querySelector('.graph-header');

    thisPcIcon.addEventListener('click', () => {
        graphContainer.classList.toggle('hidden');
    });

    // draggable logic
    let isDragging = false;
    let offsetX, offsetY;

    graphHeader.addEventListener('mousedown', (e) => {
        isDragging = true;
        const rect = graphContainer.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        graphContainer.style.transition = 'none'; // disable transitions while dragging
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        graphContainer.style.transition = ''; // restore transitions
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        graphContainer.style.left = `${e.clientX - offsetX}px`;
        graphContainer.style.top = `${e.clientY - offsetY}px`;
    });
});