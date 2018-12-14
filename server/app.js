import '@babel/polyfill';
import express from 'express';
import { json, urlencoded } from 'body-parser';
import morgan from 'morgan';
import { join } from 'path';
import { middleware } from 'jsend';
import cors from 'cors';
import helmet from 'helmet';
import routers from './routes/index';

const { log } = console;
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.static(join(__dirname, '..', '/UI')));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(middleware);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('combined'));
}

app.get('/', (req, res) => {
  res.send('Welcome to Ireporter Api');
});

routers(app);

const port = process.env.PORT || 2080;

app.listen(port, () => {
  log(`App listening on port ${port}`);
});

process.on('uncaughtException', err => log('uncaught exception', err));
process.on('unhandledRejection', err => log('unhandled rejection', err));

export default app;
