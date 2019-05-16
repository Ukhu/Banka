const transactionList = document.getElementById('transactions');
const viewMoreButton = document.getElementById('view-more');
const transactionOverlay = document.getElementById('transaction-history-overlay');
const closeButton = document.getElementById('close-modal');
const dateCreatedOn = document.getElementById('dateCreatedOn');
const transactionId = document.getElementById('transactionId');
const accountNumber = document.getElementById('accountNumber');
const accountType = document.getElementById('accountType');
const transactionAmount = document.getElementById('transactionAmount');
const oldBalance = document.getElementById('oldBalance');
const newBalance = document.getElementById('newBalance');

let afterCursor;

window.onload = () => {
  fetch(`http://localhost:3000/api/v1/accounts/${window.sessionStorage.currentAccountNumber}/transactions`, {
    headers: {
      'x-access-token': `${window.sessionStorage.token}`,
    },
  }).then(response => response.json())
    .then((data) => {
      console.log(data);
      afterCursor = data.cursor.after;

      data.data.forEach((transaction) => {
        const individualTransaction = document.createElement('li');
        individualTransaction.classList.add('transaction');
        individualTransaction.setAttribute('id', transaction.transactionId);

        individualTransaction.innerHTML = `
          <div class="indiv-trans display-full-div">
              <p>${transaction.createdOn.slice(0, 10)}</p>
              <p>${transaction.type}</p>
              <p>N${transaction.amount}</p>
              <p>N${transaction.newBalance}</p>
          </div>
        `;

        individualTransaction.addEventListener('click', () => {
          window.sessionStorage.transactionId = individualTransaction.getAttribute('id');
          transactionOverlay.style.display = 'block';


          fetch(`http://localhost:3000/api/v1/transactions/${window.sessionStorage.transactionId}`, {
            headers: {
              'x-access-token': `${window.sessionStorage.token}`,
            },
          }).then(response => response.json())
            .then((responseData) => {
              dateCreatedOn.innerHTML = `<p>${responseData.data[0].createdOn}</p>`;
              transactionId.innerHTML = `<p>${responseData.data[0].transactionId.slice(0, 8)}</p>`;
              accountNumber.innerHTML = `<p>${responseData.data[0].accountNumber}</p>`;
              accountType.innerHTML = `<p>${responseData.data[0].type}</p>`;
              transactionAmount.innerHTML = `<p>N${responseData.data[0].amount}</p>`;
              oldBalance.innerHTML = `<p>N${responseData.data[0].oldBalance}</p>`;
              newBalance.innerHTML = `<p>N${responseData.data[0].newBalance}</p>`;
            });
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
                <p>N${transaction.amount}</p>
                <p>N${transaction.newBalance}</p>
            </div>
          `;

              individualTransaction.addEventListener('click', () => {
                window.sessionStorage.transactionId = individualTransaction.getAttribute('id');
                transactionOverlay.style.display = 'block';


                fetch(`http://localhost:3000/api/v1/transactions/${window.sessionStorage.transactionId}`, {
                  headers: {
                    'x-access-token': `${window.sessionStorage.token}`,
                  },
                }).then(response => response.json())
                  .then((responseData) => {
                    dateCreatedOn.innerHTML = `<p>${responseData.data[0].createdOn}</p>`;
                    transactionId.innerHTML = `<p>${responseData.data[0].transactionId.slice(0, 8)}</p>`;
                    accountNumber.innerHTML = `<p>${responseData.data[0].accountNumber}</p>`;
                    accountType.innerHTML = `<p>${responseData.data[0].type}</p>`;
                    transactionAmount.innerHTML = `<p>N${responseData.data[0].amount}</p>`;
                    oldBalance.innerHTML = `<p>N${responseData.data[0].oldBalance}</p>`;
                    newBalance.innerHTML = `<p>N${responseData.data[0].newBalance}</p>`;
                  });
              });

              transactionList.appendChild(individualTransaction);
            });
          } else {
            afterCursor = '';
          }
        });
    }
  };

  closeButton.onclick = () => {
    transactionOverlay.style.display = 'none';
  };
};
