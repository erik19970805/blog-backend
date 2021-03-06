import axios, { AxiosResponse, Method } from 'axios';

const { env } = process;

export const db = env.MONGODB_URL ? env.MONGODB_URL : 'mongodb://localhost/blog';

export const typeToken = {
  activeToken: env.ACTIVE_TOKEN ? env.ACTIVE_TOKEN : 'secret1',
  accessToken: env.ACCESS_TOKEN ? env.ACCESS_TOKEN : 'secret2',
  refreshToken: env.REFRESH_TOKEN ? env.REFRESH_TOKEN : 'secret3',
};

export const port = env.PORT ? env.PORT : 4000;

export const urlClient = env.CLIENT_URL ? env.CLIENT_URL : 'http://localhost:3000';

export const apiGoogle = {
  clientID: env.MAIL_CLIENT_ID ? env.MAIL_CLIENT_ID : '',
  clientSecret: env.MAIL_CLIENT_SECRET ? env.MAIL_CLIENT_SECRET : '',
  refreshToken: env.MAIL_REFRESH_TOKEN ? env.MAIL_REFRESH_TOKEN : '',
  senderEmailAddress: env.SENDER_EMAIL_ADDRESS ? env.SENDER_EMAIL_ADDRESS : '',
  oauthPlayground: env.OAUTH_PLAYGROUND ? env.OAUTH_PLAYGROUND : '',
};

export const twilio = {
  accountSid: env.TWILIO_ACCOUNT_SID ? env.TWILIO_ACCOUNT_SID : '',
  authToken: env.TWILIO_AUTH_TOKEN ? env.TWILIO_AUTH_TOKEN : '',
  from: env.TWILIO_PHONE_NUMBER ? env.TWILIO_PHONE_NUMBER : '',
  serviceID: env.TWILIO_SERVICE_ID ? env.TWILIO_SERVICE_ID : '',
};

export const apiFacebook = {
  apiFB1: env.API_FB1,
  apiFB2: env.API_FB2,
};

export const api = (method: Method, url: string): Promise<AxiosResponse> => axios({ url, method });
