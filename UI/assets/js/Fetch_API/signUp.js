const signupForm = document.getElementById('sign_up');
const messageDisplay = document.getElementById('message');

signupForm.onsubmit = (e) => {
  e.preventDefault();
  const firstname = document.getElementById('firstName');
  const lastname = document.getElementById('lastName');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirmPassword');

  if (password.value !== confirmPassword.value) {
    messageDisplay.textContent = 'Passwords do not match';
    messageDisplay.style.display = 'block';

    setTimeout(() => {
      messageDisplay.style.display = 'none';
    }, 5000);
  } else {
    fetch('https://osaukhu-banka.herokuapp.com/api/v1/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstname.value,
        lastName: lastname.value,
        email: email.value,
        password: password.value,
      }),
    }).then(response => response.json())
      .then((data) => {
        if (data.data) {
          window.sessionStorage.token = data.data[0].token;
          window.sessionStorage.currentUser = JSON.stringify(data.data[0]);
          window.location.assign(
            'https://ukhu.github.io/Banka/UI/create_account.html',
          );
        } else {
          messageDisplay.textContent = data.error;
          messageDisplay.style.display = 'block';

          setTimeout(() => {
            messageDisplay.style.display = 'none';
          }, 5000);
        }
      });
  }
};
