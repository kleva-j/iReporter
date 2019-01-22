const token = () => localStorage.getItem('BEARER_TOKEN');

/**
 * @async Fetch
 * @param {String} url the url to make request to
 * @param {String} method the type of request to be made
 * @param {Object} data the payload
 * @returns {Object} an object containing the result of the fetch
 */
const Fetch = async (url, method, data) => {
  const headers = new Headers();
  headers.append('authorization', `Bearer ${token()}`);
  const request = new Request(url, {
    headers,
    method,
    body: data,
  });
  const result = await (await fetch(request)).json();
  return result;
};

/**
 *
 * @function getRecords
 * @param {String} type either a redflag or an intervention
 * @param {String} id the id of the record default is null
 * @return {Object} an object containing the users records
 */
export const fetchUserRecords = async (type, id) => {
  const url = id ? `http://localhost:2080/api/v1/${type}s/${id}` : `http://localhost:2080/api/v1/${type}s`;

  try {
    const result = await Fetch(url, 'GET');
    return result;
  } catch (err) {
    throw err;
  }
};

/**
 *
 * @function deleteRecord
 * @param {String} type either a redflag or an intervention
 * @param {String} id the id of the record default is null
 * @return {Object} an object containing the users records
 */
export const deleteRecords = async (type, id) => {
  const url = `http://localhost:2080/api/v1/${type}/${id}`;

  try {
    const result = await Fetch(url, 'DELETE');
    return result;
  } catch (err) {
    throw err;
  }
};

/**
 * @function fetchRecordsFromStore
 * @description fetch users records from the localstorage
 * @returns {Array} an array of user records from the localstorage
 */
export const fetchRecordsFromStore = () => {
  const records = localStorage.getItem('IREPORTER_RECORDS');
  if (records) return JSON.parse(records);
  return [];
};

/**
 * @function addRecordToStore
 * @description update the localstorage object store
 * @param {Object} record the new object
 * @return {undefined} returns undefined
 */
export const addRecordToStore = (record) => {
  const records = fetchRecordsFromStore();
  const newRecord = records.push(record);
  localStorage.setItem('IREPORTER_RECORDS', JSON.stringify(newRecord));
};

/**
 * @function removeRecordFromStore
 * @description update the localstorage object store
 * @param {Object} id the id of the object
 * @return {undefined} returns undefined
 */
export const removeRecordFromStore = (id) => {
  const records = fetchRecordsFromStore();
  const index = records.findIndex(item => item.id === id);
  if (index !== -1) {
    records.splice(index, 1);
    localStorage.setItem('IREPORTER_RECORDS', JSON.stringify(records));
  }
};

/**
 * @function editRecordInStore
 * @description update the localstorage object store
 * @param {Object} record the updated object
 * @return {undefined} returns undefined
 */
export const editRecordInStore = (record) => {
  const records = fetchRecordsFromStore();
  const oldRecord = records.findIndex(item => item.id === record.id);
  if (oldRecord) {
    records.splice(oldRecord, 1, record);
    localStorage.setItem('IREPORTER_RECORDS', JSON.stringify(records));
  }
};
