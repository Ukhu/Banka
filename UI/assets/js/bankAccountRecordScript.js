const icon = document.querySelector('#credit-card-icon');
const transactionOverlay = document.getElementById('perform-transaction-overlay');
const overlayContent = document.getElementById('trans-overlay-content');
const deleteButton = document.querySelector('.delete-acc-btn');
const deleteConfirmationModal = document.getElementById('delete-account-modal');

icon.onclick = () => {
  transactionOverlay.style.display = 'block';
  overlayContent.style.display = 'block';
  deleteConfirmationModal.style.display = 'none';
};

transactionOverlay.onclick = () => {
  transactionOverlay.style.display = 'none';
};

overlayContent.onclick = (e) => {
  e.stopPropagation();
};

deleteButton.onclick = () => {
  transactionOverlay.style.display = 'block';
  deleteConfirmationModal.style.display = 'block';
  overlayContent.style.display = 'none';
};
