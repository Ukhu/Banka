const accountNumber = document.getElementById('accountNumber');
const accountBalance = document.getElementById('accountBalance');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const email = document.getElementById('email');


window.onload = () => {
  fetch(`https://osaukhu-banka.herokuapp.com/api/v1/users/${JSON.parse(window.sessionStorage.currentUser).email}/accounts`, {
    headers: {
      'x-access-token': `${window.sessionStorage.token}`,
    },
  }).then(response => response.json())
    .then((data) => {
      window.sessionStorage.currentAccountNumber = data.data[0].accountNumber;
      accountNumber.innerHTML = `${data.data[0].accountNumber}`;
      accountBalance.innerHTML = `N${data.data[0].balance}`;
      firstName.innerHTML = `<span>First Name:</span> ${JSON.parse(window.sessionStorage.currentUser).firstName}`;
      lastName.innerHTML = `<span>Last Name:</span> ${JSON.parse(window.sessionStorage.currentUser).lastName}`;
      email.innerHTML = `<span>Email:</span> ${JSON.parse(window.sessionStorage.currentUser).email}`;
    });
};
