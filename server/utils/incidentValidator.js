/* eslint-disable consistent-return */
/* eslint-disable no-useless-escape */
const locationRegex = new RegExp('^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$');

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
      location,
      images,
      videos,
      comment,
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
    if (!type.includes('red-flag') || !type.includes('intervention')) {
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

    // validate location
    if (typeof location !== 'string' || !(location instanceof String)) {
      return res.status(400).json({
        status: 400,
        message: 'Geographical coordinates are invalid',
      });
    }

    if (!locationRegex.test(location)) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid coordinates',
      });
    }

    if (!location) {
      return res.status(400).json({
        status: 400,
        message: 'Geographical coordinates were not found',
      });
    }

    // validate comments
    if (typeof comment !== 'string' || comment.length > 250) {
      return res.status(400).json({
        status: 400,
        meessage: 'Maximum number of word is 250 characters',
      });
    }

    return next;
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
    let { id } = req.params;

    if (!id) {
      return res.status(403).json({
        status: 404,
        data: 'Incomplete request, red-flag id is empty',
      });
    }

    id = parseInt(id, 10);

    if (typeof id !== 'number') {
      return res.status(400).json({
        status: 400,
        data: 'red-flag Id should be a number',
      });
    }

    req.params.id = parseInt(id, 10);

    return next();
  }
}

export default IncidentValidator;
