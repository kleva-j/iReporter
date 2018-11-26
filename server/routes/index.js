import userRouter from './userRoute';

export default (app) => {
  app.use('/api/v1/users/auth', userRouter);
};
