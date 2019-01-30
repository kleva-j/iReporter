/* eslint-disable no-unused-expressions */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
const { log, error } = console;
const sendResults = async (url, method, data) => {
  const headers = new Headers();
  headers.append('authorization', `Bearer ${localStorage.getItem('BEARER_TOKEN')}`);
  const request = new Request(url, {
    headers, method, mode: 'cors', body: data,
  });
  const result = await fetch(request);
  return result;
};

const renderMap = (lng, lat) => {
  try {
    mapboxgl.accessToken = 'pk.eyJ1Ijoia2FzbWlja2xldmEiLCJhIjoiY2pscDUwYnp5MjE5MjNybjMzeXV2cjN3eiJ9.FsWFFeDKlZTDmzzBkZjZhg';

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
  } catch (err) {
    error(err);
  }
};

navigator.geolocation.getCurrentPosition((position) => {
  const { latitude, longitude } = position.coords;
  const lat = latitude; const lng = longitude;
  const coords = document.querySelector('#address');
  coords.value = `${lng}, ${lat}`;
  renderMap(longitude, latitude);
});

const validateLocation = (geocode) => {
  const regex = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/;
  return regex.test(geocode);
};

const findLocation = (evt) => {
  if (evt) evt.preventDefault();
  const newCoords = document.querySelector('#address');
  const step = newCoords.value.split(',').map(item => item.trim()).join(',');
  if (!validateLocation(step, newCoords)) {
    newCoords.setCustomValidity('Geo coordinates are invalid');
    return false;
  }
  const [lng, lat] = step.split(',');
  renderMap(lng, lat);
  return [lng, lat];
};

const loadFiles = (evt) => {
  if (evt.target.files && evt.target.files[0]) {
    const { files } = evt.target;
    const output = document.querySelector('#displayEvidence');
    output.innerHTML = '';

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const dataURL = fileReader.result;
        if (file.type.includes('image')) {
          const img = new Image();
          img.src = dataURL;
          img.className = 'w-200';
          output.appendChild(img);
        }
      };
      if (file) fileReader.readAsDataURL(file);
    }
  }
};

const uploadFile = async (files) => {
  const cloudname = 'dojy8fbrj';
  const uploadPreset = 'mvyefkkh';
  const file = files[0];
  const formData = new FormData();
  formData.append('upload_preset', uploadPreset);
  formData.append('file', file);
  const url = `https://api.cloudinary.com/v1_1/${cloudname}/upload`;
  try {
    const sendFile = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    return sendFile;
  } catch (err) {
    error(err);
  }
};

const createRecord = async (event) => {
  event.preventDefault(); const submitButton = event.currentTarget.querySelector('[type=submit]');
  const header = document.querySelector('.breadboard-header').children[0].innerText;
  const type = header.toLowerCase().includes('red-flag') ? 'red-flag' : 'intervention';
  const title = document.getElementById('title').value;
  const comment = document.getElementById('textarea').value;
  const location = findLocation(); submitButton.disabled = true;
  const { files } = document.querySelector('.file1');
  const url = `${window.location.origin}/api/v1/${type}s`;
  const formData = new FormData();
  if (location) formData.append('location', location);
  formData.append('type', type); formData.append('comment', `${title}>>${comment}`);
  try {
    if (files.length) {
      const uploads = await (await uploadFile(files)).json();
      if (uploads.status === 200) {
        const { resource_type: resourceType, url: uploadUrl } = uploads;
        formData.append(`${resourceType}`, uploadUrl);
      }
    }
    const result = await (await sendResults(url, 'POST', formData)).json();
    submitButton.disabled = false;
    if (result.status === 201) window.location.pathname = type === 'red-flag' ? '/api/v1/redflag' : '/api/v1/intervention';
  } catch (err) {
    error(err); submitButton.disabled = false;
  }
};

const pathname = window.location.pathname.split('/');
if (pathname.includes('create')) {
  document.querySelector('.file1')
    .addEventListener('change', loadFiles);
  document.querySelector('.createRecord')
    .addEventListener('submit', createRecord);
}
document.querySelector('.address')
  .addEventListener('click', findLocation);
