const icon = document.querySelector('#credit-card-icon');
const exitButton = document.getElementById('close-modal');
const transactionOverlay = document.getElementById(
  'perform-transaction-overlay',
);
const overlayContent = document.getElementById('trans-overlay-content');
const deleteButton = document.querySelector('.delete-acc-btn');
const deleteConfirmationModal = document.getElementById('delete-account-modal');

icon.onclick = () => {
  transactionOverlay.style.display = 'block';
  overlayContent.style.display = 'block';
  deleteConfirmationModal.style.display = 'none';
};

exitButton.onclick = () => {
  transactionOverlay.style.display = 'none';
};

deleteButton.onclick = () => {
  transactionOverlay.style.display = 'block';
  deleteConfirmationModal.style.display = 'block';
  overlayContent.style.display = 'none';
};
