const path = window.location.pathname.split('/').sort((a, b) => b.length - a.length);
const id = path[path.length - 2]; let type = path[0];

const token = localStorage.getItem('BEARER_TOKEN');

const Fetch = async (url, method, data) => {
  const request = new Request(url, {
    headers: new Headers({
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }),
    method,
  });

  if (data) {
    request.body = JSON.stringify(data);
  }

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
  const { subject, body, location } = getInputFields('value');
  const updatedLocation = await (await Fetch(updatelocationEndpoint, 'PATCH', { location: location.value })).json();
  const updatedComment = await (await Fetch(updateCommentEndpoint, 'PATCH', { comment: `${subject}>>${body}` })).json();
  console.log(updatedLocation);
  console.log(updatedComment);
};

const populateFields = async () => {
  const url = (type === 'redflag') ? `/api/v1/red-flags/${id}` : `/api/v1/${type}s/${id}`;
  try {
    const { data } = await (await Fetch(url, 'GET')).json();
    const { comment } = data[0];
    const [heading, rest] = comment.split('>>');
    const { subject, body } = getInputFields();
    subject.value = heading;
    body.value = rest;
  } catch (error) {
    console.error(error);
  }
};

populateFields();

document.querySelector('.update')
  .addEventListener('click', updateRecord);
