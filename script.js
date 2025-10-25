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
    // hide the loader completely
    loader.classList.add('hidden');
    desktop.classList.remove('hidden');

    const taskbar = document.querySelector('.taskbar');

    // ensure it’s hidden first
    taskbar.classList.remove('show');

    // use requestAnimationFrame to wait for reflow
    requestAnimationFrame(() => {
        setTimeout(() => {
            taskbar.classList.add('show'); // fade in taskbar
        }, 500); // adjust 500ms to match desired boot timing
    });
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
const graphs = [
  document.getElementById('graph1'),
  document.getElementById('graph2'),
  document.getElementById('graph3')
];

// When clicking "This PC", open all three vertically
thisPcIcon.addEventListener('click', () => {
  const startTop = 100;
  graphs.forEach((graph, index) => {
    if (graph.classList.contains('hidden')) {
      graph.classList.remove('hidden');
      graph.style.top = `${startTop + index * 60}px`;
      graph.style.left = `${150 + index * 40}px`;
    } else {
      graph.classList.add('hidden');
    }
  });
});

// Make each graph draggable
graphs.forEach(graph => {
    const header = graph.querySelector('.graph-header');
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    // When mouse is pressed down on the header
    header.addEventListener('mousedown', (e) => {
        isDragging = true;

        // Get current position
        const rect = graph.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        // Bring the dragged graph to the front
        graph.style.zIndex = 1000;

        // Disable transition while dragging
        graph.style.transition = 'none';
    });

    // Stop dragging when mouse is released
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            graph.style.transition = ''; // restore transitions if any
        }
    });

    // Move the graph as mouse moves
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        e.preventDefault();

        // Calculate new position
        const newLeft = e.clientX - offsetX;
        const newTop = e.clientY - offsetY;

        // Set the position
        graph.style.left = `${newLeft}px`;
        graph.style.top = `${newTop}px`;
    });
});
});