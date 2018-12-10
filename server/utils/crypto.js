const bcrypt = require('bcryptjs');

/**
 * @class Cryptolize
 * @classdesc encrypt and decrypt user password
 */
class Cryptolize {
  /**
   * @static
   * @param {object} plainData - the data to be encrypted
   * @return {object} - returns the encrypted data
   * @memberof Cryptolize
   */
  static encrypt(plainData) {
    const salt = bcrypt.genSaltSync();
    const encryptedData = bcrypt.hashSync(plainData, salt);
    return encryptedData;
  }

  /**
   * @static
   * @param {object} encryptedData - the data to be decrypted
   * @param {object} compareCrypt - the data to be compared
   * @return {boolean} - returns the encrypted data
   * @memberof Cryptolize
   */
  static decrypt(encryptedData, compareCrypt) {
    return bcrypt.compareSync(encryptedData, compareCrypt);
  }
}

module.exports = Cryptolize;
