const urlPath = window.location.pathname.split('/');
const page = urlPath[urlPath.length - 1];

const notify = (errorMessage) => {
  const elem = document.querySelector('.notify');
  elem.innerText = errorMessage;
  elem.style.backgroundColor = '#dc3545';
  elem.style.color = 'white';
  elem.style.paddingLeft = '10px';
  elem.style.paddingTop = '10px';
  elem.style.paddingBottom = '10px';
};

const adminLogin = async (event) => {
  event.preventDefault();
  const username = document.querySelector('input[name=admin]').value;
  const password = document.querySelector('input[name=adminPass]').value;
  const URlParams = new URLSearchParams({ username, password });
  const url = `${window.location.origin}/api/v1/users/auth/login`;
  const result = await (await fetch(url, {
    headers: new Headers(),
    method: 'POST',
    body: URlParams,
  })).json();
  if (result.status === 200) {
    const { data } = result;
    const { token } = data[0];
    window.localStorage.clear();
    window.localStorage.setItem('BEARER_TOKEN', token);
    window.location.pathname = '/api/v1/admin/redflags';
  } else if (result.status === 400 || result.status === 403 || result.status === 404) {
    const { error } = result;
    notify(error);
  }
};

const getRecords = async (type) => {
  const url = `/api/v1/${type}s`;
  const config = {
    headers: new Headers(),
    method: 'GET',
  };
  const result = await (await fetch(url, config)).json();
  return result;
};


if (page === 'login') {
  document.querySelector('.adminlogin')
    .addEventListener('submit', adminLogin);
}
