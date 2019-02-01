/* eslint-disable array-callback-return */
const urlPath = window.location.pathname.split('/');
const page = urlPath[urlPath.length - 1];
const recordType = page === 'redflags' ? 'red-flags' : 'interventions';
const headers = new Headers();

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
  const result = await (await fetch(url, { headers, method: 'POST', body: URlParams })).json();
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

const showResults = (result) => {
  let list = ''; let indicator = '';
  result.map((item) => {
    const { status, createdon, id } = item; const type = item.type.replace('-', ''); let { comment } = item;
    [comment] = comment.split('>>');
    const [, month, date] = (new Date(createdon).toDateString()).split(' ');
    switch (status) {
      case 'Resolved':
        indicator = 'grn';
        break;
      case 'Rejected':
        indicator = 'red';
        break;
      case 'Under investigation':
        indicator = 'yel';
        break;
      default:
        indicator = '';
    }
    list += `
    <li class="item list" data-id=${id} data-type=${item.type} id=${id}><div class="date t-c">${date}<br> ${month}</div><div class="grow-1"><a href="/api/v1/admin/${type}/${id}" class="pd-l"><b class="wrap">${comment}</b></a><div class="pd-l"><small class="pd-r-sm pd-l-sm"> status: <i class="${indicator}">${status}</i></small></div></div></li>`;
  });
  return list;
};

const getRecords = async (type, callback) => {
  const url = `/api/v1/${type}`;
  headers.append('authorization', `Bearer ${localStorage.getItem('BEARER_TOKEN')}`);
  const config = {
    headers,
    method: 'GET',
  };
  const result = await (await fetch(url, config)).json();
  if (result.status === 200) {
    const listElem = document.querySelector('.dip').children[0];
    const data = Object.values(result)[1];
    listElem.innerHTML = (data && data.length) ? callback(data) : ('No records created yet');
  } else window.location.pathname = '/api/v1/users/auth/admin/login';
};

const updateStatus = async () => {
  const recordId = page;
  const newPage = urlPath[urlPath.length - 2];
  const newRecordType = newPage === 'redflags' ? 'red-flags' : 'interventions';
  const url = `/api/v1/${newRecordType}/${recordId}/status`;
  const currentStatus = document.querySelector('.current_status').value;
  const selectedStatus = document.querySelector('.select').value;
  if (currentStatus === 'resolved') notify();
  if (currentStatus === selectedStatus) notify();
  const params = new URLSearchParams({ status: selectedStatus });
  headers.append('authorization', `Bearer ${localStorage.getItem('BEARER_TOKEN')}`);
  const postReq = await (await fetch(url, { headers, method: 'POST', body: params })).json();
  if (postReq.status !== 200) notify();
};

if (page === 'login') {
  document.querySelector('.adminlogin')
    .addEventListener('submit', adminLogin);
} else if (page === 'redflags' || page === 'interventions') getRecords(recordType, showResults);
else {
  document.querySelector('#comment')
    .addEventListener('click', updateStatus);
}
