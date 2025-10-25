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

// when clicking "This PC", open all three vertically
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

// make each graph draggable
graphs.forEach(graph => {
    const header = graph.querySelector('.graph-header');
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    // when mouse is pressed down on the header
    header.addEventListener('mousedown', (e) => {
        isDragging = true;

        // get current position
        const rect = graph.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        // bring the dragged graph to the front
        graph.style.zIndex = 1000;

        // disable transition while dragging
        graph.style.transition = 'none';
    });

    // stop dragging when mouse is released
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            graph.style.transition = ''; // restore transitions if any
        }
    });

    // move the graph as mouse moves
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        e.preventDefault();

        // calculate new position
        const newLeft = e.clientX - offsetX;
        const newTop = e.clientY - offsetY;

        // set the position
        graph.style.left = `${newLeft}px`;
        graph.style.top = `${newTop}px`;
    });
});

// photo app functionality
const photosIcon = document.querySelector('img[alt="Photos"]').closest('.desktop-icon');
const photosApp = document.getElementById('photosApp');
const closePhotos = document.getElementById('closePhotos');
const gallery = document.getElementById('photosGallery');
const placeholder = document.querySelector('.placeholder');

// array of images in you photos folder-- test wsith 5 first
const photoFiles = [
  'IMG_4339.HEIC',
  'IMG_4340.HEIC',
  'IMG_4341.HEIC',
  'IMG_4343.HEIC',
  'IMG_4345.HEIC'
];

// populate the gallery with photos
function loadGallery() {
  if (placeholder) placeholder.remove();
  photoFiles.forEach(file => {
    const img = document.createElement('img');
    img.src = `/photos/${file}`;
    img.alt = file;
    gallery.appendChild(img);
  });
}

// open photo window
photosIcon.addEventListener('click', () => {
  photosApp.classList.toggle('hidden');
  photosApp.style.top = '100px';
  photosApp.style.left = '150px';
  loadGallery(); // load photos whenever opened
});

// close photo window
closePhotos.addEventListener('click', () => {
  photosApp.classList.add('hidden');
});

// make the photos window draggable
(function makeDraggable(element, handle) {
  let isDragging = false, offsetX = 0, offsetY = 0;

  handle.addEventListener('mousedown', (e) => {
    isDragging = true;
    const rect = element.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    element.style.zIndex = 9999;
  });

  document.addEventListener('mouseup', () => isDragging = false);

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    element.style.left = `${e.clientX - offsetX}px`;
    element.style.top = `${e.clientY - offsetY}px`;
  });
})(photosApp, photosApp.querySelector('.photos-header'));


});