/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
const { log } = console;

const token = () => localStorage.getItem('BEARER_TOKEN');

const Fetch = async (url, method, data) => {
  const headers = new Headers();
  const tk = token();
  headers.append('authorization', `Bearer ${tk}`);
  const request = new Request(url, {
    headers,
    method,
    body: data,
  });
  const result = await fetch(request);
  return result;
};

const fetchUserRecords = async (type) => {
  const url = `/api/v1/${type}s`;

  try {
    const result = await Fetch(url, 'GET');
    return result;
  } catch (err) {
    throw err;
  }
};

const renderResults = (result) => {
  let indicator; let list = '';
  result.map((item) => {
    const { status, comment } = item; const type = item.type.replace('-', '');
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
      <li class="item list" data-id=${item.id} data-type=${item.type} id=${item.id}>
        <div class="date t-c">18<br> Jan</div>
        <div class="grow-1">
          <a href="/api/v1/${type}/${item.id}" class="pd-l"><b>${comment}</b></a>
          <div class="pd-l"><small class="pd-r-sm pd-l-sm"> status: <i class="${indicator}">${status}</i></small></div>
        </div>
        <div class="edit">
          <span class="btn bd-grn bg-t mg-r"><a href="" class="grn">Edit</a></span>
          <span class="btn bd-red bg-t red" data-id=${item.id} data-type=${item.type}>Delete</span>
        </div>
      </li>`;
  });
  return list;
};

const deleteRecords = async (type, id) => {
  const url = `/api/v1/${type}/${id}`;
  try {
    const result = await Fetch(url, 'DELETE');
    return result;
  } catch (err) {
    throw err;
  }
};

const getTargetAttr = target => ({
  id: target.getAttribute('data-id'),
  type: target.getAttribute('data-type'),
});

const deletePost = async (obj) => {
  const { type, id } = getTargetAttr(obj);
  try {
    const res = await deleteRecords(type, id);
    if (res.data[0].message === `${type} record with id of ${id} has been deleted successfully`) {
      const element = document.getElementById(`${id}`);
      document.querySelector('.dip').children[0].removeChild(element);
    }
  } catch (error) {
    log(error);
  }
};

const mapEvent = (evt) => {
  const { target } = evt;
  switch (target.innerText) {
    case 'Delete':
      return deletePost(target);

    default:
      break;
  }
};

(async () => {
  const checkHeader = () => document.querySelector('.breadboard-header').children[0].textContent.split(' ')[1];
  const header = checkHeader().toLowerCase();
  const listElem = document.querySelector('.dip').children[0];
  const results = await fetchUserRecords(header);

  if (results.status === 200) {
    const values = Object.values(results)[1];
    listElem.innerHTML = (values && values.length > 0) ? (renderResults(values)) : ('No records created yet');
  } else {
    window.location.pathname = '/api/v1/users/auth/login';
  }

  listElem.addEventListener('click', mapEvent);
})();
