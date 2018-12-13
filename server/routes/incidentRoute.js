import { Router } from 'express';
import IncidentController from '../controllers/incidentController';
import IncidentValidator from '../utils/incidentValidator';
import authToken from '../utils/authLogin';

const {
  validateRecord,
  validateID,
  validateLocation,
  validateComment,
  validateImages,
  validateVideos,
  validateIntervention,
} = IncidentValidator;

const {
  createRecord,
  getSpecificRedFlag,
  getAllRecords,
  getAllRedflags,
  getAllInterventions,
  deleteRedFlag,
  updateRedFlagComment,
  updateRedFlagLocation,
  updateRedFlagStatus,
} = IncidentController;

const incidentRouter = Router();

// redflags
incidentRouter.route('/red-flags')
  .get(getAllRedflags)
  .post(authToken, validateRecord, validateImages,
    validateVideos, validateLocation,
    validateComment, createRecord);

incidentRouter.route('/red-flags/:id')
  .get(validateID, getSpecificRedFlag)
  .delete(authToken, validateID, deleteRedFlag);

incidentRouter.route('/red-flags/:id/location')
  .patch(authToken, validateID, validateLocation, updateRedFlagLocation);

incidentRouter.route('/red-flags/:id/comment')
  .patch(authToken, validateID, validateComment, updateRedFlagComment);

// Interventions
incidentRouter.route('/interventions')
  .get(getAllInterventions)
  .post(authToken, validateRecord, validateIntervention, validateImages,
    validateVideos, validateLocation, validateComment, createRecord);

incidentRouter.route('/intervention/:id')
  .get(validateID, getSpecificRedFlag)
  .delete(authToken, validateID, deleteRedFlag);

incidentRouter.route('/intervention/:id/location')
  .patch(authToken, validateID, validateLocation, updateRedFlagLocation);

incidentRouter.route('/intervention/:id/comment')
  .patch(authToken, validateID, validateComment, updateRedFlagComment);

// Admin
incidentRouter.route('/red-flags/all')
  .get(getAllRecords);

incidentRouter.route('/red-flags/:id/status')
  .patch(validateID, updateRedFlagStatus);

export default incidentRouter;
