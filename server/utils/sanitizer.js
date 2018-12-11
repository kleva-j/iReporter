/* eslint-disable no-useless-escape */
module.exports = (obj) => {
  const { row } = obj;
  const sanitized = row.replace(/[\(\)]/g, '').split(',');
  const [id, firstname, lastname, username, email, phonenumber] = sanitized;
  return {
    id, firstname, lastname, username, email, phonenumber,
  };
};
