import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { port } from './config/config';

// Import Routers

// Initializations
const app: Application = express();

// Settings
app.set('port', port);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());

// Routers

export default app;
