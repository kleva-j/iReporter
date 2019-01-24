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

const notify = (errorMessage) => {
  const elem = document.querySelector('.notify');
  elem.innerText = errorMessage;
  elem.style.backgroundColor = '#dc3545';
  elem.style.color = 'white';
  elem.style.paddingLeft = '10px';
  elem.style.paddingTop = '10px';
  elem.style.paddingBottom = '10px';
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

document.querySelector('.login-form')
  .addEventListener('submit', login);
