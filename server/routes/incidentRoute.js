import express from 'express';
import IncidentController from '../controllers/incidentController';
import IncidentValidator from '../utils/incidentValidator';

const {
  validateRedFlag,
  validateID,
  validateLocation,
  validateComment,
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
  .post(validateRedFlag, validateLocation, validateComment, createRedFlag);

incidentRouter.route('/red-flags/:id')
  .get(validateID, getSpecificRedFlag)
  .delete(validateID, deleteRedFlag);

incidentRouter.route('/red-flags/:id/location')
  .patch(validateLocation, updateRedFlagLocation);

incidentRouter.route('/red-flags/:id/comment')
  .patch(validateComment, updateRedFlagComment);

export default incidentRouter;
