document.addEventListener('DOMContentLoaded', function() {
  const select = document.getElementById('footageSelect');
  const video = document.getElementById('videoPlayer');
  const playPauseButton = document.getElementById('playPauseButton');
  const skipButton = document.getElementById('skipButton');
  const pinButton = document.getElementById('pinButton');
  const loadingSpinner = document.querySelector('.loading-spinner');
  const settingsButton = document.getElementById('settingsButton');
  const settingsDropdown = document.getElementById('settingsDropdown');
  const themeToggle = document.getElementById('themeToggle');
  const themeSubmenu = document.getElementById('themeSubmenu');
  const themeItems = document.querySelectorAll('.theme-item');
  
  // Initialize theme from localStorage if available
  const savedTheme = localStorage.getItem('brainrot-theme') || 'dark';
  document.body.className = `theme-${savedTheme}`;
  
  // Update active theme in dropdown
  updateActiveTheme(savedTheme);
  
  // Event listeners for video functionality
  select.addEventListener('change', changeVideo);
  playPauseButton.addEventListener('click', togglePlayPause);
  skipButton.addEventListener('click', () => setRandomTimestamp(video));
  pinButton.addEventListener('click', togglePictureInPicture);
  
  // Settings dropdown toggle
  settingsButton.addEventListener('click', function(e) {
    e.stopPropagation();
    
    // Toggle dropdown visibility
    const isVisible = settingsDropdown.classList.toggle('show');
    
    if (isVisible) {
      // Get button position
      const buttonRect = settingsButton.getBoundingClientRect();
      
      // Position dropdown relative to button
      settingsDropdown.style.top = (buttonRect.bottom + 5) + 'px';
      settingsDropdown.style.right = (window.innerWidth - buttonRect.right) + 'px';
      
      // Reset theme submenu display when opening settings
      themeSubmenu.style.display = 'none';
    }
  });
  
  // Theme toggle click
  themeToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    themeSubmenu.style.display = themeSubmenu.style.display === 'none' ? 'block' : 'none';
  });
  
  // Theme selection
  themeItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.stopPropagation();
      const theme = this.getAttribute('data-theme');
      document.body.className = `theme-${theme}`;
      localStorage.setItem('brainrot-theme', theme);
      updateActiveTheme(theme);
    });
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (settingsDropdown.classList.contains('show') && 
        !settingsDropdown.contains(e.target) && 
        e.target !== settingsButton) {
      settingsDropdown.classList.remove('show');
      themeSubmenu.style.display = 'none';
    }
  });
  
  // Function to update active theme in dropdown
  function updateActiveTheme(theme) {
    themeItems.forEach(item => {
      if (item.getAttribute('data-theme') === theme) {
        item.classList.add('active-theme');
      } else {
        item.classList.remove('active-theme');
      }
    });
  }

  video.addEventListener('loadstart', () => {
    loadingSpinner.style.display = 'block';
  });

  video.addEventListener('canplay', () => {
    loadingSpinner.style.display = 'none';
  });

  video.addEventListener('error', (e) => {
    loadingSpinner.style.display = 'none';
    console.error('Video error:', e.target.error);
    // Display a user-friendly error message if needed
  });

  video.addEventListener('enterpictureinpicture', () => {
    pinButton.classList.add('active');
  });

  video.addEventListener('leavepictureinpicture', () => {
    pinButton.classList.remove('active');
  });

  setRandomTimestamp(video);
});

function changeVideo() {
  const select = document.getElementById('footageSelect');
  const video = document.getElementById('videoPlayer');
  const source = video.querySelector('source');
  const loadingSpinner = document.querySelector('.loading-spinner');
  
  // Show loading spinner when changing video
  loadingSpinner.style.display = 'block';
  
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
      .catch(error => {
        console.error('Error playing video:', error);
        loadingSpinner.style.display = 'none';
      });
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
