import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { port, urlClient } from './config/config';

// Import Routers
import authRouter from './routes/auth.routes';
import userRouter from './routes/user.routes';

// Initializations
const app: Application = express();

// Settings
app.set('port', port);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ credentials: true, origin: urlClient }));
app.use(morgan('dev'));
app.use(cookieParser());

// Routers
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

export default app;
