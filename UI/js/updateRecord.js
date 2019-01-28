const path = window.location.pathname.split('/').sort((a, b) => b.length - a.length);
const id = path[path.length - 2]; let type = path[0];

const token = localStorage.getItem('BEARER_TOKEN');

const headers = new Headers({
  authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
});

const Fetch = async (url, method, data) => {
  let request;
  if (data) {
    request = new Request(url, {
      headers,
      method,
      body: JSON.stringify(data),
    });
  } else request = new Request(url, { headers, method });

  const result = await fetch(request);
  return result;
};

const getInputFields = () => {
  const subject = document.getElementById('title');
  const body = document.getElementById('textarea');
  const location = document.getElementById('address');
  return { subject, body, location };
};

const updateRecord = async () => {
  if (type === 'redflag') type = 'red-flag';
  const updateCommentEndpoint = `${window.location.origin}/api/v1/${type}s/${id}/comment`;
  const updatelocationEndpoint = `${window.location.origin}/api/v1/${type}s/${id}/location`;
  let { location, subject, body } = getInputFields();
  subject = subject.value.trim(); body = body.value.trim(); location = location.value;
  const comment = `${subject}>>${body}`;
  let updatedLocation; let updatedComment;
  if (location !== '') {
    updatedLocation = await (await Fetch(updatelocationEndpoint, 'PATCH', { location })).json();
  }
  if (subject !== '' && body !== '') {
    updatedComment = await (await Fetch(updateCommentEndpoint, 'PATCH', { comment })).json();
  }
  if (type === 'red-flag') type = 'redflag';
  if (updatedComment.status === 200 && updatedLocation.status === 200) window.location.pathname = `/api/v1/${type}`;
};

const populateFields = async () => {
  const url = (type === 'redflag') ? `/api/v1/red-flags/${id}` : `/api/v1/${type}s/${id}`;
  const { data } = await (await Fetch(url, 'GET')).json();
  const { comment } = data[0];
  const [heading, rest] = comment.split('>>');
  const { subject, body } = getInputFields();
  subject.value = heading;
  body.value = rest;
};

populateFields();

document.querySelector('.update')
  .addEventListener('click', updateRecord);
