const { log } = console;
const token = () => localStorage.getItem('BEARER_TOKEN');

const Fetch = async (url, method) => {
  const headers = new Headers();
  const tk = token();
  headers.append('authorization', `Bearer ${tk}`);
  const request = new Request(url, {
    headers,
    method,
  });
  const result = await fetch(request);
  return result;
};

const showResult = ({
  comment, date: time, status, location, images, videos,
}) => {
  const [lng, lat] = location.split(',');
  const [day, month, date, year] = time.split(' ');
  const evidence = document.querySelector('.imageEvidence');
  const title = document.querySelector('#title_t');
  const details = document.querySelector('#date');

  details.innerHTML = `
    <div><b>Created on:</b> ${day}, ${date} ${month} ${year}</div>
    <div><b>Status:</b> ${status}</div>
    <div><b>Location(Geo-coord):</b> <i class"pd-l">Lng:${lng}, Lat:${lat}</i></div>
  `;

  if (images.length !== 0) {
    let img = '';
    images.map((image) => {
      img += `<img src="/${image}" alt="" class="flex-center w-75 min-w-300">`;
    });
    evidence.innerHTML = img;
  }
  if (videos.length !== 0) {
    let vid = '';
    videos.map((video) => {
      vid += `<video class="flex-center w-75 min-w-300" src="/${video}" controls preload></video>`;
    });
    evidence.innerHTML += vid;
  }
  title.innerText = comment;
};

const fetchSingleRecord = async () => {
  const path = (window.location.pathname.split('/'));
  const id = path[path.length - 1];
  const type = path[path.length - 2];
  const url = (type === 'redflag') ? `/api/v1/red-flags/${id}` : `/api/v1/${type}s/${id}`;
  const getRecord = await Fetch(url, 'GET');

  if (getRecord.status === 200) {
    const { data } = await getRecord.json();
    log(data);
    const {
      comment, createdon, location, status, type, id, images, videos, createdby,
    } = data[0];
    const date = new Date(createdon).toDateString();
    showResult({
      comment, date, status, location, images, videos,
    });
  }
};

fetchSingleRecord();