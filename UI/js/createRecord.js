/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
const sendResults = async (url, method, data) => {
  const headers = new Headers();
  headers.append('authorization', `Bearer ${localStorage.getItem('BEARER_TOKEN')}`);
  const request = new Request(url, {
    headers, method, mode: 'cors', body: data,
  });
  const result = await fetch(request);
  return result;
};

mapboxgl.accessToken = 'pk.eyJ1Ijoia2FzbWlja2xldmEiLCJhIjoiY2pscDUwYnp5MjE5MjNybjMzeXV2cjN3eiJ9.FsWFFeDKlZTDmzzBkZjZhg';

const renderMap = (lng, lat) => {
  const map = new mapboxgl.Map({
    container: 'map', // HTML container id
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [lng, lat], // starting position as [lng, lat]
    zoom: 12,
  });

  const popup = new mapboxgl.Popup()
    .setHTML('<h3>Current Location</h3><p>A good coffee shop</p>');

  const marker = new mapboxgl.Marker()
    .setLngLat([lng, lat])
    .setPopup(popup)
    .addTo(map);
};

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    renderMap(longitude, latitude);
  });
}

const validateLocation = (geocode, inputElem) => {
  const regex = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/;

  if (!regex.test(geocode)) {
    inputElem.setCustomValidity('Geo coordinates are invalid');
  }
};

const findLocation = (evt) => {
  if (evt) evt.preventDefault();
  const coords = document.querySelector('#address');
  const geocode = coords.value.split(',').map(item => item.trim());
  validateLocation(geocode.join(', '), coords);
  const [lng, lat] = geocode;
  renderMap(lng, lat);
  return [lng, lat];
};

const loadFiles = (evt) => {
  if (evt.target.files && evt.target.files[0]) {
    const { files } = evt.target;
    const output = document.querySelector('#displayEvidence');

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const dataURL = fileReader.result;
        if (file.type.includes('image')) {
          const img = new Image();
          img.src = dataURL;
          img.className = 'w-25';
          output.appendChild(img);
        }
      };
      if (file) fileReader.readAsDataURL(file);
    }
  }
};

const createRecord = async (event) => {
  event.preventDefault();
  const header = document.querySelector('.breadboard-header').children[0].innerText;
  const type = header.toLowerCase().includes('red-flag') ? 'red-flag' : 'intervention';
  const title = document.getElementById('title').value;
  const comment = document.getElementById('textarea').value;
  const evidence = document.querySelector('.file1').files[0];
  const location = findLocation();
  const url = `${window.location.origin}/api/v1/${type}s`;
  const formData = new FormData();
  formData.append('type', type);
  formData.append('location', location);
  formData.append('evidence', evidence);
  formData.append('comment', `${title}>>${comment}`);
  const result = await sendResults(url, 'POST', formData);
  if (result.status === 201) {
    const newResult = await result.json();
    window.location.pathname = type === 'red-flag' ? '/api/v1/redflag' : '/api/v1/intervention';
  }
};

const locate = document.querySelector('.address')
  .addEventListener('click', findLocation);

document.querySelector('.file1')
  .addEventListener('change', loadFiles);

document.querySelector('.createRecord')
  .addEventListener('submit', createRecord);
