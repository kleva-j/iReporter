import { Router } from 'express';
import { sendFileResponse } from '../utils/sanitizer';
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

// Red-flag pages
incidentRouter.route('/redflag')
  .get((req, res) => sendFileResponse(res, 'redFlagRecords', 200));

incidentRouter.route('/redflag/create')
  .get((req, res) => sendFileResponse(res, 'createRedFlag', 200));

incidentRouter.route('/redflag/edit')
  .get((req, res) => sendFileResponse(res, 'editRedFlag', 200));

incidentRouter.route('/redflag/:id')
  .get((req, res) => sendFileResponse(res, 'viewRedFlag', 200));

// Interventions
incidentRouter.route('/interventions')
  .get(authToken, getUserInterventions)
  .post(authToken, validateEvidence, validateRecord,
    validateIntervention, validateLocation, validateComment, createRecord);

incidentRouter.route('/interventions/:id')
  .get(authToken, validateID, getSpecificRedFlag);

incidentRouter.route('/interventions/:id')
  .delete(authToken, validateID, deleteRedFlag);

incidentRouter.route('/interventions/:id/location')
  .patch(authToken, validateID, validateLocation, updateRedFlagLocation);

incidentRouter.route('/interventions/:id/comment')
  .patch(authToken, validateID, validateComment, updateRedFlagComment);

incidentRouter.route('/interventions/:id/addImage')
  .patch(authToken, validateID);

// Intervention pages
incidentRouter.route('/intervention')
  .get((req, res) => sendFileResponse(res, 'interventionRecords', 200));

incidentRouter.route('/intervention/create')
  .get((req, res) => sendFileResponse(res, 'createIntervention', 200));

incidentRouter.route('/intervention/edit')
  .get((req, res) => sendFileResponse(res, 'editIntervention', 200));

incidentRouter.route('/intervention/:id')
  .get((req, res) => sendFileResponse(res, 'viewIntervention', 200));

// All records
incidentRouter.route('/all')
  .get(authToken, getAllRecords);

// Admin
incidentRouter.route('/red-flags/:id/status')
  .patch(authToken, validateID, updateRedFlagStatus);

incidentRouter.route('/intervention/:id/status')
  .patch(authToken, validateID, updateRedFlagStatus);

export default incidentRouter;
