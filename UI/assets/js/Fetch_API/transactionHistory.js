const transactionList = document.getElementById('transactions');
const viewMoreButton = document.getElementById('view-more');

let afterCursor;

window.onload = () => {
  fetch(`http://localhost:3000/api/v1/accounts/${window.sessionStorage.currentAccountNumber}/transactions`, {
    headers: {
      'x-access-token': `${window.sessionStorage.token}`,
    },
  }).then(response => response.json())
    .then((data) => {
      afterCursor = data.cursor.after;

      data.data.forEach((transaction) => {
        const individualTransaction = document.createElement('li');
        individualTransaction.classList.add('transaction');
        individualTransaction.setAttribute('id', transaction.transactionId);

        individualTransaction.innerHTML = `
          <div class="indiv-trans display-full-div">
              <p>${transaction.createdOn.slice(0, 10)}</p>
              <p>${transaction.type}</p>
              <p>${transaction.amount}</p>
              <p>${transaction.newBalance}</p>
          </div>
        `;

        individualTransaction.addEventListener('click', () => {
          window.sessionStorage.transactionId = individualTransaction.getAttribute('id');
        });

        transactionList.appendChild(individualTransaction);
      });
    });

  viewMoreButton.onclick = () => {
    if (afterCursor) {
      fetch(`http://localhost:3000/api/v1/accounts/${window.sessionStorage.currentAccountNumber}/transactions?after=${afterCursor}`, {
        headers: {
          'x-access-token': `${window.sessionStorage.token}`,
        },
      }).then(response => response.json())
        .then((data) => {
          if (data.cursor.after) {
            afterCursor = data.cursor.after;

            data.data.forEach((transaction) => {
              const individualTransaction = document.createElement('li');
              individualTransaction.classList.add('transaction');
              individualTransaction.setAttribute('id', transaction.transactionId);

              individualTransaction.innerHTML = `
            <div class="indiv-trans display-full-div">
                <p>${transaction.createdOn.slice(0, 10)}</p>
                <p>${transaction.type}</p>
                <p>${transaction.amount}</p>
                <p>${transaction.newBalance}</p>
            </div>
          `;

              individualTransaction.addEventListener('click', () => {
                window.sessionStorage.transactionId = individualTransaction.getAttribute('id');
              });

              transactionList.appendChild(individualTransaction);
            });
          } else {
            afterCursor = '';
          }
        });
    }
  };
};
