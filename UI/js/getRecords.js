/* eslint-disable array-callback-return */
const checkHeader = () => document.querySelector('.breadboard-header').children[0].textContent.split(' ')[1];

const fetchRecords = async (type) => {
  const token = localStorage.getItem('BEARER_TOKEN');

  const records = await (await fetch(`http://localhost:2080/api/v1/${type}s`, {
    method: 'GET',
    headers: {
      'x-access-token': token,
    },
  })).json();

  return records;
};

/**
 * @async
 * @function getRecords
 * @returns {string} the list items
 */
async function getRecords() {
  const header = checkHeader().toLowerCase();
  const viewlink = header === 'red-flag' ? './viewRedFlag.html' : './viewIntervention.html';
  const editLink = header === 'red-flag' ? './editRedFlag.html' : './editIntervention.html';
  const listElem = document.querySelector('.dip').children[0];
  let list = '';
  const results = await fetchRecords(header);

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
        <li class="item list" id=${item.id}>
          <div class="date t-c">18<br> Jan</div>
          <div class="grow-1">
            <a href="${viewlink}" class="pd-l"><b>${comment}</b></a>
            <div class="pd-l">
              <small class="pd-r-sm pd-l-sm"> status: <i class="${indicator}">${status}</i></small>
            </div>
          </div>
          <div class="edit">
            <span class="btn bd-grn bg-t mg-r"><a href="${editLink}" class="grn">Edit</a></span>
            <span class="btn bd-red bg-t red">Delete</span>
          </div>
        </li>`;
    });
  }
  listElem.innerHTML = list;
}

getRecords();
