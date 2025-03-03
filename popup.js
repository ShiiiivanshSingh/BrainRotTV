document.addEventListener('DOMContentLoaded', function() {
  const select = document.getElementById('footageSelect');
  const video = document.getElementById('videoPlayer');
  const playPauseButton = document.getElementById('playPauseButton');
  const skipButton = document.getElementById('skipButton');
  const pinButton = document.getElementById('pinButton');
  const loadingSpinner = document.querySelector('.loading-spinner');
  
  select.addEventListener('change', changeVideo);
  playPauseButton.addEventListener('click', togglePlayPause);
  skipButton.addEventListener('click', () => setRandomTimestamp(video));
  pinButton.addEventListener('click', togglePictureInPicture);

  // Show spinner when video is loading
  video.addEventListener('loadstart', () => {
    loadingSpinner.style.display = 'block';
  });

  // Hide spinner when video can play
  video.addEventListener('canplay', () => {
    loadingSpinner.style.display = 'none';
  });

  // Also hide spinner if video errors
  video.addEventListener('error', () => {
    loadingSpinner.style.display = 'none';
  });

  // Add PiP event listeners
  video.addEventListener('enterpictureinpicture', () => {
    pinButton.classList.add('active');
  });

  video.addEventListener('leavepictureinpicture', () => {
    pinButton.classList.remove('active');
  });

  // Initial random timestamp for the first video
  setRandomTimestamp(video);
});

function changeVideo() {
  const select = document.getElementById('footageSelect');
  const video = document.getElementById('videoPlayer');
  const source = video.querySelector('source');
  
  if (select.value === 'subway') {
    source.src = 'footage/subway/subway_gameplay.mp4';
  } else if (select.value === 'family') {
    source.src = 'footage/familyguy/family_guy.mp4';
  } else if (select.value === 'gta') {
    source.src = 'footage/gta/gta_ramp.mp4';
  }
  
  // Force video reload and play
  video.load();
  video.addEventListener('loadedmetadata', function() {
    setRandomTimestamp(video);
    video.play()
      .catch(error => console.error('Error playing video:', error));
  }, { once: true });
}

function setRandomTimestamp(video) {
  if (video.readyState > 0) {
    const randomTime = Math.random() * video.duration;
    video.currentTime = randomTime;
  } else {
    video.addEventListener('loadedmetadata', function() {
      const randomTime = Math.random() * video.duration;
      video.currentTime = randomTime;
    }, { once: true });
  }
}

function togglePlayPause() {
  const video = document.getElementById('videoPlayer');
  const button = document.getElementById('playPauseButton');
  const icon = button.querySelector('i');
  
  if (video.paused) {
    video.play();
    icon.className = 'fas fa-pause';
  } else {
    video.pause();
    icon.className = 'fas fa-play';
  }
}

async function togglePictureInPicture() {
  const video = document.getElementById('videoPlayer');
  const pinButton = document.getElementById('pinButton');
  
  try {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
      pinButton.classList.remove('active');
    } else {
      await video.requestPictureInPicture();
      pinButton.classList.add('active');
    }
  } catch (error) {
    console.error('Picture-in-Picture failed:', error);
  }
}
