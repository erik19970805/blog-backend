/* eslint-disable import/first */
/* eslint-disable import/newline-after-import */
/* eslint-disable no-console */
import { config } from 'dotenv';
config();
import app from './app';
import './database';

function main() {
  app.listen(app.get('port'));
  console.log('Server on port: ', app.get('port'));
}

main();
