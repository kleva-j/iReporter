'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* eslint-disable consistent-return */


var _index = require('../models/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Incidents = _index2.default.Incidents,
    Users = _index2.default.Users;

/**
 * @class IncidentController
 * @classdesc Implements red-flag creation, edition and deletion
 */

var IncidentController = function () {
  function IncidentController() {
    _classCallCheck(this, IncidentController);
  }

  _createClass(IncidentController, null, [{
    key: 'createRedFlag',

    /**
     * Create a red-flag incident
     *
     * @static
     * @param {object} req - The request object
     * @param {object} res - The response object
     * @return {object} token or message
     * @memberof IncidentController
     */
    value: function createRedFlag(req, res) {
      var _req$body = req.body,
          createdBy = _req$body.createdBy,
          type = _req$body.type,
          location = _req$body.location,
          images = _req$body.images,
          videos = _req$body.videos,
          comment = _req$body.comment;


      var userId = createdBy;

      var isUserIdValid = Users.findIndex(function (user) {
        return user.id === userId;
      });

      if (isUserIdValid !== -1) {
        var newIncident = {
          id: Incidents[Incidents.length - 1].id + 1,
          createOn: new Date().toString(),
          createdBy: createdBy,
          type: type,
          location: location,
          status: 'draft',
          images: images,
          videos: videos,
          comment: comment
        };

        Incidents.push(newIncident);

        return res.status(200).json({
          status: 200,
          data: [{
            id: newIncident,
            message: 'Created red-flag record'
          }]
        });
      }

      return res.status(404).json({
        status: 404,
        error: 'User id is invalid'
      });
    }

    /**
     * Get a specific red-flag incident
     *
     * @static
     * @param {object} req - The request object
     * @param {object} res - The response object
     * @return {object} token or message
     * @memberof IncidentController
     */

  }, {
    key: 'getSpecificRedFlag',
    value: function getSpecificRedFlag(req, res) {
      var id = req.params.id;


      var redFlag = Incidents.find(function (incident) {
        return incident.id === id;
      });
      if (redFlag) {
        return res.status(200).json({
          status: 200,
          data: [redFlag]
        });
      }

      return res.status(404).json({
        status: 404,
        error: 'Red-flag with id of ' + id + ' was not found'
      });
    }

    /**
     * Get all red-flag incidents
     *
     * @static
     * @param {object} req - The request object
     * @param {object} res - The response object
     * @return {object} token or message
     * @memberof IncidentController
     */

  }, {
    key: 'getAllRedFlag',
    value: function getAllRedFlag(req, res) {
      return res.status(200).json({
        status: 200,
        data: Incidents
      });
    }

    /**
     * Delete a red-flag incident
     *
     * @static
     * @param {object} req - The request object
     * @param {object} res - The response object
     * @return {object} token or message
     * @memberof IncidentController
     */

  }, {
    key: 'deleteRedFlag',
    value: function deleteRedFlag(req, res) {
      var id = req.params.id;


      var redFlagIndex = Incidents.findIndex(function (incident) {
        return incident.id === id;
      });

      if (redFlagIndex !== -1) {
        Incidents.splice(redFlagIndex, 1);
        return res.status(200).json({
          status: 200,
          data: [{
            id: id,
            message: 'red-flag record has been deleted'
          }]
        });
      }

      return res.status(404).json({
        status: 404,
        error: 'Red-flag with id of ' + id + ' was not found'
      });
    }

    /**
     * Update a red-flag comment
     *
     * @static
     * @param {object} req - The request object
     * @param {object} res - The response object
     * @return {object} token or message
     * @memberof IncidentController
     */

  }, {
    key: 'updateRedFlagComment',
    value: function updateRedFlagComment(req, res) {
      var id = req.params.id;
      var comment = req.body.comment;

      id = parseInt(id, 10);
      var redFlagIndex = Incidents.findIndex(function (incident) {
        return incident.id === id;
      });
      if (redFlagIndex !== -1) {
        Incidents[redFlagIndex].comment = comment;
        var redFlag = Incidents[redFlagIndex];
        return res.status(200).json({
          status: 200,
          data: [{
            id: redFlag.id,
            message: 'Updated red-flag record’s location'
          }]
        });
      }

      return res.status(404).json({
        status: 404,
        error: 'Red-flag with id of ' + id + ' was not found'
      });
    }

    /**
     * Update a red-flag comment
     *
     * @static
     * @param {object} req - The request object
     * @param {object} res - The response object
     * @return {object} token or message
     * @memberof IncidentController
     */

  }, {
    key: 'updateRedFlagLocation',
    value: function updateRedFlagLocation(req, res) {
      var id = req.params.id;
      var location = req.body.location;

      id = parseInt(id, 10);
      var redFlagIndex = Incidents.findIndex(function (incident) {
        return incident.id === id;
      });
      if (redFlagIndex !== -1) {
        Incidents[redFlagIndex].location = location;
        var redFlag = Incidents[redFlagIndex];
        return res.status(200).json({
          status: 200,
          data: [{
            id: redFlag.id,
            message: 'Updated red-flag record’s location'
          }]
        });
      }

      return res.status(404).json({
        status: 404,
        error: 'Red-flag with id of ' + id + ' was not found'
      });
    }
  }]);

  return IncidentController;
}();

exports.default = IncidentController;