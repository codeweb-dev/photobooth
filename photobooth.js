document.addEventListener("DOMContentLoaded", () => {
  window.addEventListener("load", () => {
    const overlay = document.getElementById("transition-overlay");
    setTimeout(() => {
      overlay.classList.add("translate-y-full");
      setTimeout(() => {
        overlay.style.display = "none";
      }, 1000);
    }, 3000); // Delay to ensure the overlay is visible first
  });

  document.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const overlay = document.getElementById("transition-overlay");
      overlay.style.display = "block";
      overlay.classList.remove("translate-y-full");
      setTimeout(() => {
        window.location.href = e.target.href;
      }, 1000);
    });
  });

  let video = document.querySelector('#webcam');
  let photoContainer = document.querySelector('.photo-container');
  let timerDisplay = document.createElement('div');
  timerDisplay.className = 'timer-display';
  video.parentElement.style.position = 'relative'; // Ensure the parent has relative positioning
  video.parentElement.appendChild(timerDisplay); // Append to the parent of video

  function webcam(btn) {
    if(btn == 'pause') {
      video.pause();
    } else {
      video.play();
    }
  }

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({video: true})
      .then(function(stream) {
        video.srcObject = stream;
      })
      .catch(function(e) {
        console.log(e);
      });
  }

  function takePhoto() {
    let canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    let context = canvas.getContext('2d');
    context.translate(canvas.width, 0);
    context.scale(-1, 1); // Mirror the image
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
    let photoWrapper = document.createElement('div');
    photoWrapper.className = 'photo-wrapper relative mb-6';
  
    let img = document.createElement('img');
    img.src = canvas.toDataURL('image/png');
    img.className = 'photo border border-gray-400 rounded-2xl h-[200px] object-cover bg-center';
  
    let buttonContainer = document.createElement('div');
    buttonContainer.className = 'photo-buttons absolute flex gap-3';

    let deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fa-solid fa-x"></i>';
    deleteButton.addEventListener('click', () => {
        photoWrapper.remove();
        updatePhotoCount();
    });

    let checkButton = document.createElement('button');
    checkButton.innerHTML = '<i class="fa-solid fa-check"></i>';
    checkButton.addEventListener('click', () => {
        if (img.classList.contains('selected')) {
            img.classList.remove('selected');
        } else {
            if (document.querySelectorAll('.photo.selected').length < 3) {
                img.classList.add('selected');
            } else {
                alert('You can only select up to 3 photos.');
            }
        }
        updatePhotoCount();
    });

    buttonContainer.appendChild(deleteButton);
    buttonContainer.appendChild(checkButton);

    photoWrapper.appendChild(img);
    photoWrapper.appendChild(buttonContainer);
    photoContainer.appendChild(photoWrapper);

    updatePhotoCount();
  }

  function updatePhotoCount() {
    let selectedPhotos = document.querySelectorAll('.photo.selected');
    let selectedCount = selectedPhotos.length;

    document.querySelector('.photo-count').textContent = `Selected Photos: ${selectedCount} / 3`;

    console.log(`Selected Photos: ${selectedCount}`); // Debugging

    if (selectedCount === 3) {
        setTimeout(() => {
            proceedToStrip(selectedPhotos);
        }, 500); // Small delay for smooth transition
    }
  }

  function startTimer(seconds) {
    let shots = 3; // Number of shots to take
    const messages = ["Slay!", "Smile!", "Good Job!"]; // List of messages
    let messageIndex = 0; // Index to track the current message
    const takePhotoBtn = document.querySelector('.take-photo-btn');
    takePhotoBtn.disabled = true; // Disable the button
    const originalText = takePhotoBtn.innerHTML; // Store original button text

    function countdown() {
      let count = seconds;
      timerDisplay.textContent = count;
      timerDisplay.style.display = 'block';
      timerDisplay.classList.add('animate-timer');
      takePhotoBtn.innerHTML = `${shots} shots remaining`;
      let interval = setInterval(() => {
        count--;
        if (count > 0) {
          timerDisplay.textContent = count;
        } else {
          clearInterval(interval);
          flashCamera();
          takePhoto();
          shots--;
          // takePhotoBtn.innerHTML = `${shots} shots remaining`; // Update button text
          if (shots > 0) {
            timerDisplay.textContent = messages[messageIndex];
            messageIndex = (messageIndex + 1) % messages.length; // Move to the next message
            setTimeout(() => {
              countdown(); // Start the next countdown
            }, 1000); // Display the message for 1 second before the next countdown
          } else {
            timerDisplay.style.display = 'none';
            timerDisplay.classList.remove('animate-timer');
            takePhotoBtn.disabled = false; // Re-enable the button
            takePhotoBtn.innerHTML = originalText; // Restore original button text
          }
        }
      }, 1000);
    }
    countdown(); // Start the first countdown
  }

  function flashCamera() {
    let flash = document.createElement('div');
    flash.className = 'camera-flash';
    document.body.appendChild(flash);
    setTimeout(() => {
      flash.remove();
    }, 100);
  }

  document.querySelector('.take-photo-btn').addEventListener('click', () => {
    let timerValue = parseInt(document.querySelector('.timer-select').value);
    startTimer(timerValue);
  });

  document.querySelector('.proceed-btn').addEventListener('click', () => {
    document.querySelector('main').classList.add('hidden');
    document.getElementById('photo-strip-page').classList.remove('hidden');
    populatePhotoStrip();
  });

  function proceedToStrip(selectedPhotos) {
    const selectedPhotoData = Array.from(selectedPhotos).map(photo => photo.src);
    localStorage.setItem('selectedPhotos', JSON.stringify(selectedPhotoData));
    window.location.href = 'customize.html';
  }

  function populatePhotoStrip(selectedPhotos) {
    let photoStrip = document.querySelector('.photo-strip');
    photoStrip.innerHTML = ''; // Clear previous selections

    selectedPhotos.forEach(photo => {
        let img = document.createElement('img');
        img.src = photo.src; // Use correct image source
        img.classList.add('rounded-lg', 'w-[100px]', 'h-[150px]'); // Styling

        console.log(`Adding photo: ${img.src}`); // Debugging

        photoStrip.appendChild(img);
    });
}

  document.querySelector('.save-photo-strip-btn').addEventListener('click', () => {
    alert('Photo strip saved!');
    // Add functionality to save the photo strip
  });
});