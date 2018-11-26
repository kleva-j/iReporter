import express from 'express';
import IncidentController from '../controllers/incidentController';
import IncidentValidator from '../utils/incidentValidator';

const { validateRedFlag } = IncidentValidator;

const { createRedFlag } = IncidentController;

const incidentRouter = express.Router();

incidentRouter.route('/red-flag')
  .post(validateRedFlag, createRedFlag);

export default incidentRouter;
