document.getElementById('helloButton').addEventListener('click', function() {
  const message = document.getElementById('message');
  const videoContainer = document.getElementById('videoContainer');
  
  // Show and animate message
  message.textContent = 'hello world and fellow skibidi folks!!';
  message.classList.add('show');
  
  // Show video container with delay
  setTimeout(() => {
    videoContainer.classList.add('show');
    // Update body height smoothly
    document.body.style.height = 'auto';
    document.body.style.minHeight = '450px';
  }, 500);
  
  // Disable button after click
  this.disabled = true;
  this.style.opacity = '0.7';
  this.style.cursor = 'default';
}); 