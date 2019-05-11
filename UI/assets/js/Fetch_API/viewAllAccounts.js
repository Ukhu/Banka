const accountsList = document.getElementById('accounts');
const accounts = document.getElementsByClassName('account');


window.onload = () => {
  fetch('http://localhost:3000/api/v1/accounts', {
    headers: {
      'x-access-token': `${window.sessionStorage.token}`,
    },
  }).then(response => response.json())
    .then((data) => {
      data.data.forEach((account) => {
        const individualAccount = document.createElement('li');
        const currentUser = JSON.parse(window.sessionStorage.currentUser);

        let accountType;
        if (account.type === 'savings') {
          accountType = 'S';
        } else {
          accountType = 'C';
        }

        let nextURL;

        if (currentUser.type === 'staff' && currentUser.isAdmin === true) {
          nextURL = 'bank_account_record_admin.html';
        } else if (currentUser.type === 'staff' && currentUser.isAdmin === false) {
          nextURL = 'bank_account_record_cashier.html';
        } else {
          nextURL = '#';
        }

        individualAccount.innerHTML = `
          <a id="${account.accountNumber}" class="account" href="${nextURL}">
              <li>
                <div class="indiv-acc display-full-div">
                  <p class="acc-list-val">${account.accountNumber}</p>
                  <p class="acc-list-val-1">${account.ownerFirstName} ${account.ownerLastName}</p>
                  <p class="acc-list-val">${account.balance}</p>
                  <p class="acc-list-val-0">${accountType}</p>
                </div>
              </li>
          </a>
        `;

        accountsList.appendChild(individualAccount);
      });

      [...accounts].forEach(account => account.addEventListener('click', () => {
        window.sessionStorage.currentAccountNumber = account.getAttribute('id');
      }));
    });
};
