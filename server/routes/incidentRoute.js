import express from 'express';
import IncidentController from '../controllers/incidentController';
import IncidentValidator from '../utils/incidentValidator';

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
} = IncidentController;

const incidentRouter = express.Router();

incidentRouter.route('/red-flags')
  .get(getAllRedFlag)
  .post(validateRedFlag, validateImages, validateVideos, validateLocation, validateComment, createRedFlag);

incidentRouter.route('/red-flags/:id')
  .get(validateID, getSpecificRedFlag)
  .delete(validateID, deleteRedFlag);

incidentRouter.route('/red-flags/:id/location')
  .patch(validateID, validateLocation, updateRedFlagLocation);

incidentRouter.route('/red-flags/:id/comment')
  .patch(validateID, validateComment, updateRedFlagComment);

export default incidentRouter;
