const createAccountForm = document.getElementById('create-account-form');
const messageDisplay = document.getElementById('message');

createAccountForm.onsubmit = (e) => {
  e.preventDefault();
  const accountType = document.querySelector('select');
  fetch('http://localhost:3000/api/v1/accounts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': `${window.sessionStorage.token}`,
    },
    body: JSON.stringify({
      type: accountType.value,
    }),
  }).then(response => response.json())
    .then((data) => {
      if (data.data) {
        window.sessionStorage.accountDetails = JSON.stringify(data.data[0]);
        window.location.assign(
          'file:///C:/Users/uk1/Desktop/PROJECTS/Banka/UI/dashboard.html',
        );
      } else {
        messageDisplay.textContent = data.errors;
        messageDisplay.style.display = 'block';

        setTimeout(() => {
          messageDisplay.style.display = 'none';
        }, 5000);
      }
    });
};
