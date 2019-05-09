const signInForm = document.getElementById('sign-in');
const messageDisplay = document.getElementById('message');

signInForm.onsubmit = (e) => {
  e.preventDefault();
  const email = document.getElementById('email');
  const password = document.getElementById('password');

  fetch('http://localhost:3000/api/v1/auth/signin', {
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

        switch (data.data[0].type) {
          case 'client':
            window.location.assign(
              'file:///C:/Users/uk1/Desktop/PROJECTS/Banka/UI/dashboard.html',
            );
            break;
          default:
            console.log('hey');
            if (data.data[0].isAdmin === true) {
              window.location.assign(
                'file:///C:/Users/uk1/Desktop/PROJECTS/Banka/UI/admin_dashboard.html',
              );
            } else {
              window.location.assign(
                'file:///C:/Users/uk1/Desktop/PROJECTS/Banka/UI/cashier_dashboard.html',
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
