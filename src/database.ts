/* eslint-disable no-console */
import { connect, connection, ConnectOptions } from 'mongoose';
import { db } from './config/config';

const dbOptions: ConnectOptions = {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

connect(db, dbOptions);

connection.once('open', () => {
  console.log('Mongodb Connection stablished');
});

connection.on('error', (err) => {
  console.log('Mongodb connection error:', err);
  process.exit();
});
