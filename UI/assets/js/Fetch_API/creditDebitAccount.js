const transactionType = document.getElementById('transactionType');
const amount = document.getElementById('amount');
const creditDebitForm = document.getElementById('creditDebitForm');
const balance = document.getElementById('totalBalance');
const modal = document.getElementById('perform-transaction-overlay');
const messageDisplay = document.getElementById('message');

const { currentAccountNumber } = window.sessionStorage;

creditDebitForm.onsubmit = (e) => {
  e.preventDefault();
  fetch(`https://osaukhu-banka.herokuapp.com/api/v1/transactions/${currentAccountNumber}/${transactionType.value}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': `${window.sessionStorage.token}`,
    },
    body: JSON.stringify({
      amount: amount.value,
    }),
  }).then(response => response.json())
    .then((data) => {
      if (data.data) {
        balance.innerHTML = `<span>Total Balance:</span> N${data.data[0].accountBalance}`;
        amount.value = '';
        modal.style.display = 'none';
      } else {
        messageDisplay.textContent = data.error;
        messageDisplay.style.display = 'block';

        setTimeout(() => {
          messageDisplay.style.display = 'none';
        }, 5000);
      }
    });
};
