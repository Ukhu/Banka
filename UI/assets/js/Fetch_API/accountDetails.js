const activateDeactivateButton = document.getElementById('activateDeactivateButton');
const activateDeactivateForm = document.getElementById('activateDeactivateForm');
const accountId = document.getElementById('accountId');
const accountNumber = document.getElementById('accountNumber');
const ownerId = document.getElementById('ownerId');
const createdOn = document.getElementById('createdOn');
const accountType = document.getElementById('accountType');
const accountStatus = document.getElementById('accountStatus');
const totalBalance = document.getElementById('totalBalance');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const email = document.getElementById('email');


window.onload = () => {
  fetch(`http://localhost:3000/api/v1/accounts/${window.sessionStorage.currentAccountNumber}`, {
    headers: {
      'x-access-token': `${window.sessionStorage.token}`,
    },
  }).then(response => response.json())
    .then((data) => {
      accountId.innerHTML = `<span>Account ID:</span> ${data.data[0].accountID.slice(0, 8)}`;
      accountNumber.innerHTML = `<span>Account Number:</span> ${data.data[0].accountNumber}`;
      ownerId.innerHTML = `<span>Owner:</span> ${data.data[0].owner.slice(0, 8)}`;
      createdOn.innerHTML = `<span>Created On:</span> ${data.data[0].createdOn}`;
      accountType.innerHTML = `<span>Type:</span> ${data.data[0].type}`;
      accountStatus.innerHTML = `<span>Status:</span> ${data.data[0].status}`;
      totalBalance.innerHTML = `<span>Total Balance:</span> N${data.data[0].balance}`;
      firstName.innerHTML = `<span>First Name:</span> ${data.data[0].ownerFirstName}`;
      lastName.innerHTML = `<span>Last Name:</span> ${data.data[0].ownerLastName}`;
      email.innerHTML = `<span>Email:</span> ${data.data[0].ownerEmail}`;

      activateDeactivateButton.textContent = (data.data[0].status === 'active') ? 'Deactivate' : 'Activate';
    });

  activateDeactivateForm.onsubmit = (e) => {
    e.preventDefault();

    const status = (activateDeactivateButton.textContent === 'Activate') ? 'active' : 'dormant';

    fetch(`http://localhost:3000/api/v1/accounts/${window.sessionStorage.currentAccountNumber}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': `${window.sessionStorage.token}`,
      },
      body: JSON.stringify({
        status,
      }),
    }).then(response => response.json())
      .then((data) => {
        accountStatus.innerHTML = `<span>Status:</span> ${data.data[0].status}`;
        activateDeactivateButton.textContent = (data.data[0].status === 'active') ? 'Deactivate' : 'Activate';
      });
  };
};
