/* eslint-disable consistent-return */
/* eslint-disable no-return-assign */
const token = localStorage.getItem('BEARER_TOKEN');

const Fetch = async (url, method) => {
  const headers = new Headers();
  headers.append('authorization', `Bearer ${token}`);
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
  const body = document.getElementById('comment');
  const details = document.querySelector('#date');

  details.innerHTML = `
    <div><b>Created on:</b> ${day}, ${date} ${month} ${year}</div>
    <div><b>Status:</b> ${status}</div>
    <div><b>Location(Geo-coord):</b> <i class"pd-l">Lng: ${lng}, Lat: ${lat}</i></div>`;

  if (images.length !== 0) {
    let img = '';
    images.map(image => (img += `<img src="/${image}" alt="" class="flex-center w-100 max-w-500">`));
    evidence.innerHTML = img;
  } if (videos.length !== 0) {
    let vid = '';
    videos.map(video => (vid += `<video width="640" height="480" controls class="flex-center w-75" src="/${video}" controls preload></video>`));
    evidence.innerHTML += vid;
  }
  const [heading, content] = comment.split('>>');
  title.innerText = heading;
  body.innerText = content;
};

const fetchSingleRecord = async (callback) => {
  const path = window.location.pathname.split('/').sort((a, b) => b.length - a.length);
  const id = path[path.length - 2]; const type = path[0];
  const url = (type === 'redflag') ? `/api/v1/red-flags/${id}` : `/api/v1/${type}s/${id}`;
  const getRecord = await Fetch(url, 'GET');
  if (getRecord.status === 200) {
    const { data } = await getRecord.json();
    const {
      comment, createdon, location, status, images, videos,
    } = data[0];
    const date = new Date(createdon).toDateString();
    if (callback) {
      return callback({
        comment, date, status, location, images, videos,
      });
    }
  }
};

fetchSingleRecord(showResult);
