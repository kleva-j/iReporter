/* eslint-disable no-mixed-operators */
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
    if (!req.body.images) {
      return res.status(400).json({
        status: 400,
        error: 'Image evidence were not sent',
      });
    }

    const { images } = req.body;

    const regEX = images.toString().replace(/[\[\]\/]/g, '').split(', ');

    const isValidImg = regEX.every(image => (image.endsWith('.jpg') || image.endsWith('.jpeg') || image.endsWith('png') && typeof image === 'string'));

    if (!isValidImg) {
      return res.status(400).json({
        status: 400,
        error: 'Images should be a string with either of these extension formats jpg, png or jpeg',
      });
    }

    req.body.images = regEX;

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
  static validateVideos(req, res, next) {
    if (!req.body.videos) {
      return res.status(400).json({
        status: 400,
        error: 'Video evidences were not sent',
      });
    }

    const { videos } = req.body;
    const videoData = videos.toString().replace(/[\[\]\/]/g, '').split(', ');

    const isValidVid = videoData.every(video => (video.endsWith('.avi') || video.endsWith('.mp4') || video.endsWith('mkv') && typeof video === 'string'));

    if (!isValidVid) {
      return res.status(400).json({
        status: 400,
        error: 'Video urls should be a string datatype with endings of either avi, mkv or mp4',
      });
    }

    req.body.videos = videoData;

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

module.exports = IncidentValidator;
