import { Router } from 'express';
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
  getAllRecords,
  getAllRedflags,
  getAllInterventions,
  deleteRedFlag,
  updateRedFlagComment,
  updateRedFlagLocation,
  updateRedFlagStatus,
} = IncidentController;

const incidentRouter = Router();

incidentRouter.route('/red-flags')
  .get(getAllRedflags)
  .post(validateRedFlag, validateImages,
    validateVideos, validateLocation,
    validateComment, createRedFlag);

incidentRouter.route('/red-flags/all')
  .get(getAllRecords);

incidentRouter.route('/red-flags/:id')
  .get(validateID, getSpecificRedFlag)
  .delete(validateID, deleteRedFlag);

incidentRouter.route('/interventions')
  .get(getAllInterventions);

incidentRouter.route('/red-flags/:id/location')
  .patch(validateID, validateLocation, updateRedFlagLocation);

incidentRouter.route('/red-flags/:id/comment')
  .patch(validateID, validateComment, updateRedFlagComment);

incidentRouter.route('/red-flags/:id/status')
  .patch(validateID, updateRedFlagStatus);

export default incidentRouter;
