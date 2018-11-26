import express from 'express';
import IncidentController from '../controllers/incidentController';
import IncidentValidator from '../utils/incidentValidator';

const { validateRedFlag, validateID } = IncidentValidator;

const { createRedFlag, getSpecificRedFlag } = IncidentController;

const incidentRouter = express.Router();

incidentRouter.route('/red-flag')
  .get(validateID, getSpecificRedFlag)
  .post(validateRedFlag, createRedFlag);

export default incidentRouter;
