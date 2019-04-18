const penIcon = document.getElementById('pen-icon');
const exitButton = document.getElementById('close-modal');
const updateAccountOverlay = document.getElementById('update-account-overlay');

penIcon.onclick = () => {
  updateAccountOverlay.style.display = 'block';
};

exitButton.onclick = () => {
  updateAccountOverlay.style.display = 'none';
};
