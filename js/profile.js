const populateProfileDetails = () => {
  const {
    firstname, lastname, username, email, phonenumber,
  } = JSON.parse(localStorage.getItem('USER_DETAILS'));
  const name = document.querySelector('#name');
  const uname = document.querySelector('#uname');
  const eMail = document.querySelector('#email');
  const phone = document.querySelector('#phone');
  name.innerText = `${firstname} ${lastname}`;
  uname.innerText = username;
  eMail.innerText = email;
  phone.innerText = phonenumber;
};

populateProfileDetails();
