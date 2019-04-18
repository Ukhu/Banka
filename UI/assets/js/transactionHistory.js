const closeButton = document.getElementById('close-modal');
const transactionOverlay = document.getElementById('transaction-history-overlay');

closeButton.onclick = () => {
  transactionOverlay.style.display = 'none';
};
