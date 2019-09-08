const signInForm = document.getElementById('sign-in');
const messageDisplay = document.getElementById('message');

signInForm.onsubmit = (e) => {
  e.preventDefault();
  const email = document.getElementById('email');
  const password = document.getElementById('password');

  fetch('https://osaukhu-banka.herokuapp.com/api/v1/auth/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email.value,
      password: password.value,
    }),
  }).then(response => response.json())
    .then((data) => {
      if (data.data) {
        window.sessionStorage.token = data.data[0].token;
        window.sessionStorage.currentUser = JSON.stringify(data.data[0]);
        switch (data.data[0].type) {
          case 'client':
            window.location.assign(
              'https://ukhu.github.io/Banka/UI/dashboard.html',
            );
            break;
          default:
            if (data.data[0].isAdmin === true) {
              window.location.assign(
                'https://ukhu.github.io/Banka/UI/admin_dashboard.html',
              );
            } else {
              window.location.assign(
                'https://ukhu.github.io/Banka/UI/cashier_dashboard.html',
              );
            }
            break;
        }
      } else {
        messageDisplay.textContent = data.error;
        messageDisplay.style.display = 'block';

        setTimeout(() => {
          messageDisplay.style.display = 'none';
        }, 5000);
      }
    });
};
