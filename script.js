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

// ✅ Make sure the folder path matches your actual project structure.
// If your photos are in /assets/photos/, use that below:
const photoFiles = [
  'IMG_4339.jpg',
  'IMG_4340.jpg',
  'IMG_4341.jpg',
  'IMG_4343.jpg',
  'IMG_4345.jpg',
  'IMG_4346.jpg',
  'IMG_4348.jpg',
    'IMG_4350.jpg',
    'IMG_4352.jpg',
    'IMG_4353.jpg',
    'IMG_4354.jpg',
    'IMG_4355.jpg',
    'IMG_4356.jpg',
    'IMG_4357.jpg',
    'IMG_4362.jpg',
    'IMG_4363.jpg',
    'IMG_4364.jpg',
    'IMG_4365.jpg',
    'IMG_4366.jpg',
    'IMG_4367.jpg',
    'IMG_4368.jpg',
    'IMG_4369.jpg',
    'IMG_4370.jpg',
    'IMG_4372.jpg',
    'IMG_4373.jpg',
    'IMG_4374.jpg',
    'IMG_4375.jpg',
    'IMG_4376.jpg',
    'IMG_4378.jpg',
    'IMG_4379.jpg',
    'IMG_4385.jpg',
    'IMG_4388.jpg',
    'IMG_4389.jpg',
    'IMG_4390.jpg',
    'IMG_4391.jpg',
    'IMG_4394.jpg',
    'IMG_4581.jpg',
    'IMG_4582.jpg',
    'IMG_4583.jpg',
    'IMG_4584.jpg',
    'IMG_4591.jpg',
    'IMG_4592.jpg',
    'IMG_4593.jpg',
    'IMG_4596.jpg',
    'IMG_4597.jpg',
    'IMG_4598.jpg',
    'IMG_4599.jpg',
    'IMG_4600.jpg',
    'IMG_4601.jpg',
    'IMG_4602.jpg',
    'IMG_4603.jpg',
    'IMG_4604.jpg',
    'IMG_4605.jpg',
    'IMG_4606.jpg',
    'IMG_4607.jpg',
    'IMG_4608.jpg',
    'IMG_4609.jpg',
    'IMG_4610.jpg',
    'IMG_4612.jpg',
    'IMG_4613.jpg',
    'IMG_4646.jpg',
    'IMG_4647.jpg',
    'IMG_4648.jpg',
    'IMG_4649.jpg',
    'IMG_4650.jpg',
    'IMG_4651.jpg',
    'IMG_4652.jpg',
    'IMG_4653.jpg',
    'IMG_4654.jpg',
    'IMG_4655.jpg',
    'IMG_4656.jpg',
    'IMG_4657.jpg',
    'IMG_4658.jpg',
    'IMG_4659.jpg',
    'IMG_4660.jpg',
    'IMG_4661.jpg',
    'IMG_4662.jpg',
    'IMG_4663.jpg',
    'IMG_4664.jpg',
    'IMG_4665.jpg',
    'IMG_4666.jpg',
    'IMG_4667.jpg',
    'IMG_4668.jpg',
    'IMG_4669.jpg',
    'IMG_4670.jpg',
    'IMG_4671.jpg',
    'IMG_4672.jpg',
    'IMG_4673.jpg',
    'IMG_4674.jpg',
    'IMG_4675.jpg',
    'IMG_4676.jpg',
    'IMG_4677.jpg',
    'IMG_4678.jpg',
    'IMG_4679.jpg',
    'IMG_4680.jpg',
    'IMG_4681.jpg',
    'IMG_4682.jpg',
    'IMG_4683.jpg',
    'IMG_4684.jpg',
    'IMG_4685.jpg',
    'IMG_4686.jpg',
    'IMG_4687.jpg',
    'IMG_4688.jpg',
    'IMG_4689.jpg'
];

function loadGallery() {
  // clear gallery first so photos don't duplicate
  gallery.innerHTML = '';

  // check if photos exist
  if (photoFiles.length === 0) {
    const placeholder = document.createElement('div');
    placeholder.classList.add('placeholder');
    placeholder.textContent = 'No photos available';
    gallery.appendChild(placeholder);
    return;
  }

  // Populate with images
  photoFiles.forEach(file => {
    const img = document.createElement('img');

    // where your images actually live
    img.src = `photos/${file}`;
    img.alt = file;

    img.addEventListener('error', () => {
      img.style.display = 'none';
      console.error(`Image not found: ${img.src}`);
    });

    gallery.appendChild(img);
  });
}

// Open the Photos window
photosIcon.addEventListener('click', () => {
  photosApp.classList.toggle('hidden');
  photosApp.style.top = '100px';
  photosApp.style.left = '150px';
  loadGallery();
});

// Close the Photos window
closePhotos.addEventListener('click', () => {
  photosApp.classList.add('hidden');
});

// Make the Photos window draggable
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


// Substack popup functionality
const substackIcon = document.querySelector('img[alt="Substack"]').closest('.desktop-icon');
const substackPopup = document.getElementById('substackPopup');
const closeSubstack = document.getElementById('closeSubstack');

// open popup
substackIcon.addEventListener('click', () => {
  substackPopup.classList.toggle('hidden');
  substackPopup.style.top = '80px';
  substackPopup.style.left = '120px';
});

// close popup
closeSubstack.addEventListener('click', () => {
  substackPopup.classList.add('hidden');
});

// make popup draggable
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
})(substackPopup, substackPopup.querySelector('.substack-header'));


});