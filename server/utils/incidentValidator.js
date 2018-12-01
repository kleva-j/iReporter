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
    let { createdBy } = req.body;
    const {
      type,
    } = req.body;

    // validate createdBy
    if (!createdBy) {
      return res.status(400).json({
        status: 400,
        error: 'Red-flag creator id is not defined',
      });
    }

    createdBy = parseInt(createdBy, 10);
    if (isNaN(createdBy)) {
      return res.status(400).json({
        status: 400,
        error: 'Red-flag creator id is not a valid id',
      });
    }

    req.body.createdBy = createdBy;

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
   * Validate red-flag image
   *
   * @static
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {object} res - The next middleware
   * @return {object} token or message
   * @memberof IncidentValidator
   */
  static validateImages(req, res, next) {
    const { images } = req.body;
    const regEX = images.replace(/[\[\]\/]/g, '').split(', ');
    const imageData = images.split('').slice(1, -1).join('').split(', ');

    if (!images) {
      return res.status(400).json({
        status: 400,
        error: 'Images evidence are not available',
      });
    }

    if (!Array.isArray(imageData)) {
      return res.status(400).json({
        status: 400,
        message: 'Image sources should be contained in an array',
      });
    }

    const isValidImg = imageData.every(image => (image.endsWith('.jpg') && image.endsWith('.jpeg') && image.endsWith('png') && typeof image === 'string'));

    return isValidImg ? next() : res.status(400).json({
      status: 400,
      message: 'Images should be a string with either of these extension formats jpg, png or jpeg',
    });
  }

  /**
   * Validate red-flag image
   *
   * @static
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {object} res - The next middleware
   * @return {object} token or message
   * @memberof IncidentValidator
   */
  static validateVideos(req, res, next) {
    const { videos } = req.body;
    const videoData = videos.split('').slice(1, -1).join('').split(', ');

    if (!videos) {
      return res.status(400).json({
        status: 400,
        error: 'Video evidences are not available',
      });
    }

    if (!Array.isArray(videoData)) {
      return res.status(400).json({
        status: 400,
        message: 'Video sources should be contained in an array',
      });
    }

    videoData.forEach((video) => {
      if (typeof video !== 'string') {
        return res.status(400).json({
          status: 400,
          message: 'Video source should be of a string datatype',
        });
      }

      if (!video.endsWith('.avi') && !video.endsWith('.mp4') && !video.endsWith('.mkv')) {
        return res.status(400).json({
          status: 400,
          message: 'Accepted video formats are avi, mp4 and mkv',
        });
      }
    });

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
