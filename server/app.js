import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import path from 'path';
import jsend from 'jsend';
import cors from 'cors';
import helmet from 'helmet';

const app = express();
app.use(express.static(path.join(__dirname, '/template')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(jsend.middleware);
app.use(morgan('combined'));
app.use(cors());
app.use(helmet());

app.get('/', (req, res) => {
  res.send('Welcome to Ireporter Api');
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
