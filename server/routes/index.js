const userRouter = require('./userRoute');
const incidentRouter = require('./incidentRoute');

module.exports = (app) => {
  app.use('/api/v1/users/auth', userRouter);
  app.use('/api/v1', incidentRouter);
};
