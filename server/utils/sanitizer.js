/* eslint-disable no-useless-escape */
/**
 * @function
 * @name sanitizer
 * @param {string} obj - the result of a database query
 * @returns {object} A formated data of the user details
 */
const sanitizer = (obj) => {
  const { row } = obj;
  const sanitized = row.replace(/[\(\)]/g, '').split(',');
  const [id, firstname, lastname, username, email, phonenumber, isadmin] = sanitized;
  return {
    id, firstname, lastname, username, email, phonenumber, isadmin,
  };
};

export default sanitizer;
