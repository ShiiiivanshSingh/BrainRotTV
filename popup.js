document.getElementById('openYoutube').addEventListener('click', () => {
  chrome.tabs.create({ url: 'https://www.youtube.com' });
}); 