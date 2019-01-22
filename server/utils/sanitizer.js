/* eslint-disable no-useless-escape */
import path from 'path';
/**
 * @function
 * @name sanitizer
 * @param {string} obj - the result of a database query
 * @returns {object} A formated data of the user details
 */
export const sanitizer = (obj) => {
  const { row } = obj;
  const sanitized = row.replace(/[\(\)]/g, '').split(',');
  const [id, firstname, lastname, username, email, phonenumber, isadmin] = sanitized;
  return {
    id, firstname, lastname, username, email, phonenumber, isadmin,
  };
};

export const sendFileResponse = (responseObject, fileName, statusCode) => responseObject
  .status(statusCode)
  .sendFile(path.join(__dirname, '..', '..', 'UI', 'html', `${fileName}.html`));
