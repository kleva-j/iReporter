/* eslint-disable consistent-return */

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
  const params = {
    firstname: document.querySelector('input[name="firstname"]').value,
    lastname: document.querySelector('input[name="lastname"]').value,
    username: document.querySelector('input[name="username"]').value,
    email: document.querySelector('input[name="email"]').value,
    phonenumber: document.querySelector('input[name="phonenumber"]').value,
  };
  const password = document.querySelector('input[name="password"]');
  const password2 = document.querySelector('input[name="password2"]');
  const status = validatePassword(password, password2);
  if (!(status === 'done')) return;
  params.password = password.value;
  const url = `${window.location.origin}/api/v1/users/auth/signup`;
  const URLParams = new URLSearchParams(params);
  const result = await Fetch(url, 'POST', URLParams);
  if (result.status === 201) {
    const { data } = result; const { user, token } = data[0];
    window.localStorage.clear();
    window.localStorage.setItem('BEARER_TOKEN', token);
    window.localStorage.setItem('USER_DETAILS', JSON.stringify(user));
    window.location.replace('/api/v1/users/auth/profile');
  } else {
    const { error } = result; notify(error);
  }
};

const login = async (evt) => {
  evt.preventDefault();
  const uname = document.querySelector('input[name="username"]').value;
  const password = document.querySelector('input[name="password"]').value;
  const URLParams = new URLSearchParams({ username: uname, password });
  const url = `${window.location.origin}/api/v1/users/auth/login`;
  const result = await Fetch(url, 'POST', URLParams);
  if (result.status === 200) {
    const { data } = result;
    const {
      id, firstname, lastname, username, email, phonenumber, token,
    } = data[0];
    const user = {
      id, firstname, lastname, username, email, phonenumber,
    };
    window.localStorage.clear();
    window.localStorage.setItem('BEARER_TOKEN', token);
    window.localStorage.setItem('USER_DETAILS', JSON.stringify(user));
    window.location.replace('/api/v1/users/auth/profile');
  } else if (result.status === 400 || result.status === 403 || result.status === 404) {
    const { error } = result;
    notify(error);
  }
};

const formType = (document.querySelector('.h1').innerText).toLowerCase().trim().replace(' ', '');

if (formType === 'login') {
  document.querySelector('.login-form')
    .addEventListener('submit', login);
} else {
  document.querySelector('.login-form')
    .addEventListener('submit', signup);
}
