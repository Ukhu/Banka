const penIcon = document.getElementById('pen-icon');
const updateAccountOverlay = document.getElementById('update-account-overlay');

penIcon.onclick = () => {
  updateAccountOverlay.style.display = 'block';
};

updateAccountOverlay.onclick = () => {
  updateAccountOverlay.style.display = 'none';
};
