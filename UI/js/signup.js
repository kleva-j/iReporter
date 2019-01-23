/* eslint-disable consistent-return */
const { log } = console;
const Fetch = async (url, method, data) => {
  const headers = new Headers();
  const request = new Request(url, {
    headers,
    method,
    body: data,
  });
  const result = await (await fetch(request)).json();
  return result;
};

const validatePassword = (pass1, pass2) => {
  if (pass1.value !== pass2.value) {
    pass2.setCustomValidity('Both passwords should be the same');
    pass2.addEventListener('input', (event) => {
      if (pass1.value === event.target.value) pass2.setCustomValidity('');
      else pass2.setCustomValidity('Both passwords should be the same');
    });
  } else return 'done';
};

const notify = (errorMessage) => {
  const elem = document.querySelector('.notify');
  elem.innerText = errorMessage;
  elem.style.backgroundColor = '#dc3545';
  elem.style.color = 'white';
  elem.style.paddingLeft = '10px';
  elem.style.paddingTop = '10px';
  elem.style.paddingBottom = '10px';
};

const signup = async (eventObject) => {
  eventObject.preventDefault();
  const firstname = document.querySelector('input[name="firstname"]').value;
  const lastname = document.querySelector('input[name="lastname"]').value;
  const username = document.querySelector('input[name="username"]').value;
  const email = document.querySelector('input[name="email"]').value;
  const phonenumber = document.querySelector('input[name="phonenumber"]').value;

  const password = document.querySelector('input[name="password"]');
  const password2 = document.querySelector('input[name="password2"]');
  const status = validatePassword(password, password2);

  if (!(status === 'done')) return;

  const url = `${window.location.origin}/api/v1/users/auth/signup`;
  const params = new URLSearchParams({
    firstname, lastname, username, email, phonenumber, password: password.value,
  });

  const result = await Fetch(url, 'POST', params);

  if (result.status === 201) {
    const { data } = result;
    const { user, token } = data[0];
    window.localStorage.setItem('BEARER_TOKEN', token);
    window.localStorage.setItem('USER_DETAILS', JSON.stringify(user));
    window.location.replace('/api/v1/users/auth/profile');
  } else {
    const { status: stats, error } = result;
    log(stats, error);
    notify(error);
  }
};

document.querySelector('.login-form')
  .addEventListener('submit', signup);
