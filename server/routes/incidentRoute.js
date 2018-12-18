import { Router } from 'express';
import IncidentController from '../controllers/incidentController';
import IncidentValidator from '../utils/incidentValidator';
import authToken from '../utils/authLogin';

const {
  validateRecord,
  validateID,
  validateLocation,
  validateComment,
  validateEvidence,
  validateIntervention,
} = IncidentValidator;

const {
  createRecord,
  getSpecificRedFlag,
  getAllRecords,
  getUserRedflags,
  getUserInterventions,
  deleteRedFlag,
  updateRedFlagComment,
  updateRedFlagLocation,
  updateRedFlagStatus,
} = IncidentController;

const incidentRouter = Router();

// redflags
incidentRouter.route('/red-flags')
  .get(authToken, getUserRedflags)
  .post(authToken, validateEvidence, validateRecord,
    validateLocation, validateComment, createRecord);

incidentRouter.route('/red-flags/:id')
  .get(authToken, validateID, getSpecificRedFlag)
  .delete(authToken, validateID, deleteRedFlag);

incidentRouter.route('/red-flags/:id/location')
  .patch(authToken, validateID, validateLocation, updateRedFlagLocation);

incidentRouter.route('/red-flags/:id/comment')
  .patch(authToken, validateID, validateComment, updateRedFlagComment);

incidentRouter.route('/red-flags/:id/addImage')
  .patch(authToken, validateID);

// Interventions
incidentRouter.route('/interventions')
  .get(authToken, getUserInterventions)
  .post(authToken, validateEvidence, validateRecord,
    validateIntervention, validateLocation, validateComment, createRecord);

incidentRouter.route('/intervention/:id')
  .get(authToken, validateID, getSpecificRedFlag)
  .delete(authToken, validateID, deleteRedFlag);

incidentRouter.route('/intervention/:id/location')
  .patch(authToken, validateID, validateLocation, updateRedFlagLocation);

incidentRouter.route('/intervention/:id/comment')
  .patch(authToken, validateID, validateComment, updateRedFlagComment);

incidentRouter.route('/intervention/:id/addImage')
  .patch(authToken, validateID);

// All records
incidentRouter.route('/all')
  .get(authToken, getAllRecords);

// Admin
incidentRouter.route('/red-flags/:id/status')
  .patch(authToken, validateID, updateRedFlagStatus);

incidentRouter.route('/intervention/:id/status')
  .patch(authToken, validateID, updateRedFlagStatus);

export default incidentRouter;
