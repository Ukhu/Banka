const createStaffForm = document.getElementById('create-staff');
const messageDisplay = document.getElementById('message');

createStaffForm.onsubmit = (e) => {
  e.preventDefault();
  const firstname = document.getElementById('firstName');
  const lastname = document.getElementById('lastName');
  const email = document.getElementById('email');
  const type = document.querySelector('select');

  let isAdmin;

  if (type.value === 'cashier') {
    isAdmin = false;
  } else {
    isAdmin = true;
  }

  fetch('https://osaukhu-banka.herokuapp.com/api/v1/auth/create-staff', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': `${window.sessionStorage.token}`,
    },
    body: JSON.stringify({
      firstName: firstname.value,
      lastName: lastname.value,
      email: email.value,
      isAdmin,
    }),
  }).then(response => response.json())
    .then((data) => {
      if (data.data) {
        firstname.value = '';
        lastname.value = '';
        email.value = '';
        type.value = '';


        messageDisplay.textContent = 'Successfully created new staff';
        messageDisplay.style.backgroundColor = '#1bb669';
        messageDisplay.style.display = 'block';

        setTimeout(() => {
          messageDisplay.style.display = 'none';
        }, 5000);
      } else {
        messageDisplay.textContent = data.error;
        messageDisplay.style.display = 'block';

        setTimeout(() => {
          messageDisplay.style.display = 'none';
        }, 5000);
      }
    });
};
