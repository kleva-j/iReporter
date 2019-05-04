import userRouter from './userRoute';
import incidentRouter from './incidentRoute';

export default (app) => {
  app.use('/api/v1/user', userRouter);
  app.use('/api/v1', incidentRouter);
};
