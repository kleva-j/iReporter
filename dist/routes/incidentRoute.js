'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _incidentController = require('../controllers/incidentController');

var _incidentController2 = _interopRequireDefault(_incidentController);

var _incidentValidator = require('../utils/incidentValidator');

var _incidentValidator2 = _interopRequireDefault(_incidentValidator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var validateRedFlag = _incidentValidator2.default.validateRedFlag,
    validateID = _incidentValidator2.default.validateID,
    validateLocation = _incidentValidator2.default.validateLocation,
    validateComment = _incidentValidator2.default.validateComment;
var createRedFlag = _incidentController2.default.createRedFlag,
    getSpecificRedFlag = _incidentController2.default.getSpecificRedFlag,
    getAllRedFlag = _incidentController2.default.getAllRedFlag,
    deleteRedFlag = _incidentController2.default.deleteRedFlag,
    updateRedFlagComment = _incidentController2.default.updateRedFlagComment,
    updateRedFlagLocation = _incidentController2.default.updateRedFlagLocation;


var incidentRouter = _express2.default.Router();

incidentRouter.route('/red-flags').get(getAllRedFlag).post(validateRedFlag, validateLocation, validateComment, createRedFlag);

incidentRouter.route('/red-flags/:id').get(validateID, getSpecificRedFlag).delete(validateID, deleteRedFlag);

incidentRouter.route('/red-flags/:id/location').patch(validateLocation, updateRedFlagLocation);

incidentRouter.route('/red-flags/:id/comment').patch(validateComment, updateRedFlagComment);

exports.default = incidentRouter;