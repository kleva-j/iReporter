/* eslint-disable consistent-return */
/* eslint-disable no-useless-escape */

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
   * @param {object} res - The next middleware
   * @return {object} token or message
   * @memberof IncidentValidator
   */
  static validateRedFlag(req, res, next) {
    const {
      type,
      images,
      videos,
    } = req.body;

    // validate images
    if (!Array.isArray(images)) {
      return res.status(400).json({
        status: 400,
        message: 'Image sources should be contained in an array',
      });
    }

    images.forEach((image) => {
      if (typeof image !== 'string') {
        return res.status(400).json({
          status: 400,
          message: 'Image source should be of a string datatype',
        });
      }

      if (!image.endsWith('.jpg') || !image.endsWith('.png') || !image.endsWith('.jpeg')) {
        return res.status(400).json({
          status: 400,
          message: 'Accepted images formats are .jpg, png and jpeg',
        });
      }
    });

    // validate Videos
    if (!Array.isArray(videos)) {
      return res.status(400).json({
        status: 400,
        message: 'Video sources should be contained in an array',
      });
    }

    videos.forEach((video) => {
      if (typeof video !== 'string') {
        return res.status(400).json({
          status: 400,
          message: 'Video source should be of a string datatype',
        });
      }

      if (!video.endsWith('.mp4') || !video.endsWith('.avi') || !video.endsWith('.mkv')) {
        return res.status(400).json({
          status: 400,
          message: 'Accepted videos formats are .mp4, avi and mkv',
        });
      }
    });

    // validate type
    if (type !== 'red-flag' && type !== 'intervention') {
      return res.status(400).json({
        status: 400,
        message: 'Type of incident should either be a red-flag or an intervention',
      });
    }

    if (!type) {
      return res.status(400).json({
        status: 400,
        message: 'Type of incident not present',
      });
    }

    return next();
  }

  /**
   * Validate red-flag id
   *
   * @static
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {object} res - The next middleware
   * @return {object} token or message
   * @memberof IncidentValidator
   */
  static validateID(req, res, next) {
    if (!req.params.id) {
      return res.status(403).json({
        status: 404,
        data: 'Incomplete request, red-flag id is empty',
      });
    }

    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({
        status: 400,
        error: 'red-flag Id should be a number',
      });
    }

    req.params.id = id;

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
   * @memberof IncidentValidator
   */
  static validateComment(req, res, next) {
    const { comment } = req.body;

    if (typeof comment !== 'string' || comment.length > 350) {
      return res.status(400).json({
        status: 400,
        error: 'Maximum number of word is 350 characters',
      });
    }

    return next;
  }

  /**
   * Validate red-flag status
   *
   * @static
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {object} res - The next middleware
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
