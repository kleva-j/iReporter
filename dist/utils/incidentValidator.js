'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint-disable no-restricted-globals */
/* eslint-disable consistent-return */
/* eslint-disable no-useless-escape */
var locationRegex = new RegExp('^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$');

/**
 * @class IncidentValidator
 * @classdesc Implements validation of red-flag/intervention creation
 */

var IncidentValidator = function () {
  function IncidentValidator() {
    _classCallCheck(this, IncidentValidator);
  }

  _createClass(IncidentValidator, null, [{
    key: 'validateRedFlag',

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
    value: function validateRedFlag(req, res, next) {
      var _req$body = req.body,
          type = _req$body.type,
          images = _req$body.images,
          videos = _req$body.videos;

      // validate images

      if (!Array.isArray(images)) {
        return res.status(400).json({
          status: 400,
          message: 'Image sources should be contained in an array'
        });
      }

      images.forEach(function (image) {
        if (typeof image !== 'string') {
          return res.status(400).json({
            status: 400,
            message: 'Image source should be of a string datatype'
          });
        }

        if (!image.endsWith('.jpg') || !image.endsWith('.png') || !image.endsWith('.jpeg')) {
          return res.status(400).json({
            status: 400,
            message: 'Accepted images formats are .jpg, png and jpeg'
          });
        }
      });

      // validate Videos
      if (!Array.isArray(videos)) {
        return res.status(400).json({
          status: 400,
          message: 'Video sources should be contained in an array'
        });
      }

      videos.forEach(function (video) {
        if (typeof video !== 'string') {
          return res.status(400).json({
            status: 400,
            message: 'Video source should be of a string datatype'
          });
        }

        if (!video.endsWith('.mp4') || !video.endsWith('.avi') || !video.endsWith('.mkv')) {
          return res.status(400).json({
            status: 400,
            message: 'Accepted videos formats are .mp4, avi and mkv'
          });
        }
      });

      // validate type
      if (type !== 'red-flag' && type !== 'intervention') {
        return res.status(400).json({
          status: 400,
          message: 'Type of incident should either be a red-flag or an intervention'
        });
      }

      if (!type) {
        return res.status(400).json({
          status: 400,
          message: 'Type of incident not present'
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

  }, {
    key: 'validateID',
    value: function validateID(req, res, next) {
      if (!req.params.id) {
        return res.status(403).json({
          status: 404,
          data: 'Incomplete request, red-flag id is empty'
        });
      }

      var id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        return res.status(400).json({
          status: 400,
          error: 'red-flag Id should be a number'
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
     * @param {object} res - The next middleware
     * @return {object} token or message
     * @memberof IncidentValidator
     */

  }, {
    key: 'validateLocation',
    value: function validateLocation(req, res, next) {
      var location = req.body.location;


      if (typeof location !== 'string' || !(location instanceof String)) {
        return res.status(400).json({
          status: 400,
          message: 'Geographical coordinates are invalid'
        });
      }

      if (!location) {
        return res.status(400).json({
          status: 400,
          error: 'Location is required'
        });
      }

      if (!locationRegex.test(location)) {
        return res.status(400).json({
          status: 400,
          error: 'Invalid coordinates'
        });
      }

      return next();
    }

    /**
     * Validate red-flag comment
     *
     * @static
     * @param {object} req - The request object
     * @param {object} res - The response object
     * @param {object} res - The next middleware
     * @return {object} token or message
     * @memberof IncidentValidator
     */

  }, {
    key: 'validateComment',
    value: function validateComment(req, res, next) {
      var comment = req.body.comment;


      if (typeof comment !== 'string' || comment.length > 350) {
        return res.status(400).json({
          status: 400,
          error: 'Maximum number of word is 350 characters'
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

  }, {
    key: 'validateStatus',
    value: function validateStatus(req, res, next) {
      var status = req.body.status;


      if (!status.includes('under investigation') && !status.includes('resolved') && !status.includes('rejected')) {
        return res.status(400).json({
          status: 400,
          message: "status of incident should either be 'under investigation', resolved or rejected"
        });
      }

      if (!status) {
        return res.status(400).json({
          status: 400,
          message: 'status of incident not present'
        });
      }

      return next();
    }
  }]);

  return IncidentValidator;
}();

exports.default = IncidentValidator;