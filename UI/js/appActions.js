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
