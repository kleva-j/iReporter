/* eslint-disable no-restricted-globals */
/* eslint-disable no-mixed-operators */
/* eslint-disable no-useless-escape */
import multer from 'multer';

const regex = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/;

/**
 * @class IncidentValidator
 * @classdesc Implements validation of red-flag/intervention creation
 */
class IncidentValidator {
  /**
   * Validate Incident details
   *
   * @static
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {object} next - The next middleware
   * @return {object} token or message
   * @memberof IncidentValidator
   */
  static validateRecord(req, res, next) {
    const {
      type,
    } = req.body;

    // validate type
    if (!type) {
      return res.status(400).json({
        status: 400,
        error: 'Type of incident not present',
      });
    }

    if (type !== 'red-flag' && type !== 'intervention') {
      return res.status(400).json({
        status: 400,
        error: 'Type of incident should either be a red-flag or an intervention',
      });
    }

    return next();
  }

  /**
   *
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {*} next the next middleware
   * @returns {object} token or message
   */
  static validateIntervention(req, res, next) {
    const { type } = req.body;
    if (type !== 'intervention') {
      return res.status(403).json({
        status: 403,
        error: 'Use endpoint to create interventions',
      });
    }

    return next();
  }

  /**
   * Validate red-flag image
   *
   * @static
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {object} next - The next middleware
   * @return {object} token or message
   * @memberof IncidentValidator
   */
  static validateEvidence(req, res, next) {
    const storage = multer.diskStorage({
      destination: (_req, _file, cb) => {
        cb(null, './upload/');
      },

      filename: (reQ, file, cb) => {
        const format = file.mimetype.split('/')[1];
        cb(null, `${reQ.auth.userId}${Date.now()}.${format}`);
      },
    });

    const fileFilter = (_req, file, cb) => {
      if (file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        cb(null, true);
      } else if (file.mimetype === 'video/mp4' || file.mimetype === 'video/avi' || file.mimetype === 'video/mkv') {
        cb(null, true);
      } else cb(new Error('Unaccepted file mimetype'), false);
    };

    const upload = multer({
      storage,
      limit: {
        fileSize: 1024 * 1024 * 8,
      },
      fileFilter,
    }).array('evidence', 5);

    upload(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          status: 400,
          error: 'Error uploading file(s)',
          err,
        });
      }
      return next();
    });
  }

  /**
   * Validate red-flag id
   *
   * @static
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {object} next - The next middleware
   * @return {object} token or message
   * @memberof IncidentValidator
   */
  static validateID(req, res, next) {
    if (!req.params.id) {
      return res.status(400).json({
        status: 400,
        error: 'Red-flag id is required',
      });
    }

    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({
        status: 400,
        error: 'red-flag Id should be a number',
      });
    }

    return next();
  }

  /**
   * Validate red-flag location
   *
   * @static
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {object} next - The next middleware
   * @return {object} token or message
   * @memberof IncidentValidator
   */
  static validateLocation(req, res, next) {
    if (!req.body.location) {
      return res.status(400).json({
        status: 400,
        error: 'Location is required',
      });
    }

    const { location } = req.body;

    if (typeof location !== 'string' && !(location instanceof String)) {
      return res.status(400).json({
        status: 400,
        error: 'Geographical coordinates are not well formated to a string',
      });
    }

    const isValid = regex.test(location);

    return isValid ? next() : res.status(400).json({
      status: 400,
      error: 'Invalid coordinates',
    });
  }

  /**
   * Validate red-flag comment
   *
   * @static
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {object} next - The next middleware
   * @returns {object} token or message
   * @memberof IncidentValidator
   */
  static validateComment(req, res, next) {
    if (!req.body.comment) {
      return res.status(400).json({
        status: 400,
        error: 'Comment is required',
      });
    }

    const { comment } = req.body;

    if (typeof comment !== 'string') {
      return res.status(400).json({
        status: 400,
        error: 'Comments should be a string type value',
      });
    }

    if (comment.length > 350) {
      return res.status(400).json({
        status: 400,
        error: 'Maximum number of word is 350 characters',
      });
    }

    return next();
  }

  /**
   * Validate red-flag status
   *
   * @static
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {object} next - The next middleware
   * @return {object} token or message
   * @memberof IncidentValidator
   */
  static validateStatus(req, res, next) {
    const { status } = req.body;

    if (!status.includes('under investigation') && !status.includes('resolved') && !status.includes('rejected')) {
      return res.status(400).json({
        status: 400,
        message: "status of incident should either be 'under investigation', resolved or rejected",
      });
    }

    if (!status) {
      return res.status(400).json({
        status: 400,
        message: 'status of incident not present',
      });
    }

    return next();
  }
}

export default IncidentValidator;
