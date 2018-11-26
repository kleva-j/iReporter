import express from 'express';
import IncidentController from '../controllers/incidentController';
import IncidentValidator from '../utils/incidentValidator';

const { validateRedFlag, validateID } = IncidentValidator;

const { createRedFlag, getSpecificRedFlag } = IncidentController;

const incidentRouter = express.Router();

incidentRouter.route('/red-flags')
  .post(validateRedFlag, createRedFlag);

incidentRouter.route('/red-flags/:id')
  .get(validateID, getSpecificRedFlag);

export default incidentRouter;
