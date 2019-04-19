const exitButton = document.getElementById('close-modal');
const transactionOverlay = document.getElementById(
  'perform-transaction-overlay',
);
const deleteButton = document.querySelector('.delete-acc-btn');
const deleteConfirmationModal = document.getElementById('delete-account-modal');

exitButton.onclick = () => {
  transactionOverlay.style.display = 'none';
};

deleteButton.onclick = () => {
  transactionOverlay.style.display = 'block';
  deleteConfirmationModal.style.display = 'block';
};
