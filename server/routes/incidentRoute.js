const express = require('express');
const IncidentController = require('../controllers/incidentController');
const IncidentValidator = require('../utils/incidentValidator');

const {
  validateRedFlag,
  validateID,
  validateLocation,
  validateComment,
  validateImages,
  validateVideos,
} = IncidentValidator;

const {
  createRedFlag,
  getSpecificRedFlag,
  getAllRedFlag,
  deleteRedFlag,
  updateRedFlagComment,
  updateRedFlagLocation,
  updateRedFlagStatus,
} = IncidentController;

const incidentRouter = express.Router();

incidentRouter.route('/red-flags')
  .get(getAllRedFlag)
  .post(validateRedFlag, validateImages,
    validateVideos, validateLocation,
    validateComment, createRedFlag);

incidentRouter.route('/red-flags/:id')
  .get(validateID, getSpecificRedFlag)
  .delete(validateID, deleteRedFlag);

incidentRouter.route('/red-flags/:id/location')
  .patch(validateID, validateLocation, updateRedFlagLocation);

incidentRouter.route('/red-flags/:id/comment')
  .patch(validateID, validateComment, updateRedFlagComment);

incidentRouter.route('/red-flags/admin/:id/status')
  .patch(validateID, updateRedFlagStatus);

module.exports = incidentRouter;
