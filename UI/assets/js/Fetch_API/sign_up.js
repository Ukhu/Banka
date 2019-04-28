const signupButton = document.getElementById('sign_up');
// const signupDiv = document.getElementById('signup-form');
const messageDisplay = document.getElementById('message');

signupButton.onsubmit = (e) => {
  e.preventDefault();
  console.log('Hi I\'m working');

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
    }).then(res => res.json())
      .then((data) => {
        if (data.data.token) {
          window.location.assign(
            'file:///C:/Users/uk1/Desktop/PROJECTS/Banka/UI/create_account.html',
          );
        } else {
          console.log(data);
        }
      })
      .catch(err => console.log(err));
  }
};
