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
    list += `<li class="item list" data-id=${id} data-type=${item.type} id=${id}><div class="date t-c">${date}<br> ${month}</div><div class="grow-1"><a href="/api/v1/${type}/${id}" class="pd-l"><b>${comment}</b></a><div class="pd-l"><small class="pd-r-sm pd-l-sm"> status: <i class="${indicator}">${status}</i></small></div></div><div class="edit"><span class="btn bd-grn bg-t mg-r"><a href="/api/v1/${type}/edit/${id}" class="grn">Edit</a></span><span class="btn bd-red bg-t red" data-id=${id} data-type=${item.type}>Delete</span></div></li>`;
  }); return list;
};

const deleteRecords = async (type, id) => {
  const url = `/api/v1/${type}s/${id}`;
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
    const response = await deleteRecords(type, id);
    if (response.status === 200) {
      const value = await response.json();
      if (value.data[0].message === `${type} record with id of ${id} has been deleted successfully`) {
        const element = document.getElementById(`${id}`);
        document.querySelector('.dip').children[0].removeChild(element);
      }
    }
  } catch (error) {
    log(error);
  }
};

const getConfirmationToDelete = (target) => {
  const overlay = document.createElement('div'); const modal = document.createElement('div');
  overlay.className = 'overlay'; modal.className = 'confirmModal';
  modal.innerHTML = `<p class="pd-l pd-r f-s-2 t-c">Are you sure you want to delete this record?<p>
  <div class="j-c-sb pd-lg pT-0"><button class="red btn bd-red">Yes, delete it!</button><button class="grn btn b-grn">No, cancel!</button></div>
  `;
  const removeOverlay = () => document.body.removeChild(overlay);
  overlay.appendChild(modal); document.body.appendChild(overlay);
  overlay.addEventListener('click', (evt) => {
    const elem = evt.target.classList[0];
    switch (elem) {
      case 'red':
        removeOverlay();
        deletePost(target);
        break;

      case 'grn':
        removeOverlay();
        break;

      case 'overlay':
        removeOverlay();
        break;

      default:
        break;
    }
  });
};

const mapEvent = (evt) => {
  const { target } = evt;
  switch (target.innerText) {
    case 'Delete':
      return getConfirmationToDelete(target);

    case 'Edit':
      log('You clicked edit');
      break;

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
    const response = await results.json();
    const values = Object.values(response)[1];
    listElem.innerHTML = (values && values.length > 0) ? (renderResults(values)) : ('No records created yet');
  } else {
    window.location.pathname = '/api/v1/users/auth/login';
  }

  listElem.addEventListener('click', mapEvent);
})();
