/* eslint-disable no-restricted-globals */
/* eslint-disable array-callback-return */
import { fetchUserRecords, deleteRecords } from './appActions';

const { log } = console;

const deletePost = async (obj) => {
  const recordId = obj.attributes.getNamedItem('data-id').value;
  const recordType = obj.attributes.getNamedItem('data-type').value;
  try {
    const res = await deleteRecords(recordType, recordId);
    if (res.data[0].message === `${recordType} record with id of ${recordId} has been deleted successfully`) {
      const element = document.getElementById(`${recordId}`);
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
  const viewlink = header === 'red-flag' ? './viewRedFlag.html' : './viewIntervention.html';
  const editLink = header === 'red-flag' ? './editRedFlag.html' : './editIntervention.html';
  const listElem = document.querySelector('.dip').children[0];
  let list = '';
  const results = await fetchUserRecords(header);

  if (results.status === 200) {
    let indicator;
    const values = Object.values(results)[1];
    values.map((item) => {
      const { status, comment } = item;

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
          break;
      }

      list += `
        <li class="item list" data-id=${item.id} data-type=${item.type} id=${item.id}>
          <div class="date t-c">18<br> Jan</div>
          <div class="grow-1">
            <a href="${viewlink}" class="pd-l"><b>${comment}</b></a>
            <div class="pd-l">
              <small class="pd-r-sm pd-l-sm"> status: <i class="${indicator}">${status}</i></small>
            </div>
          </div>
          <div class="edit">
            <span class="btn bd-grn bg-t mg-r"><a href="${editLink}" class="grn">Edit</a></span>
            <span class="btn bd-red bg-t red" data-id=${item.id} data-type=${item.type}>Delete</span>
          </div>
        </li>`;
    });
  } else {
    location.pathname = '/api/v1/users/auth/login';
  }

  listElem.innerHTML = list;
  listElem.addEventListener('click', mapEvent);
})();
