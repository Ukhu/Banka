const closeButton = document.getElementById('close-modal');
const transactionOverlay = document.getElementById('transaction-history-overlay');
const transactions = document.getElementsByClassName('indiv-trans');

closeButton.onclick = () => {
  transactionOverlay.style.display = 'none';
};

console.log(transactions);
[...transactions].forEach(container => container.addEventListener('click', () => {
  transactionOverlay.style.display = 'block';
}));
