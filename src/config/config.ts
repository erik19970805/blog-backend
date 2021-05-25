const { env } = process;

export const db = env.MONGODB_URL ? env.MONGODB_URL : 'mongodb://localhost/blog';

export const typeToken = {
  activeToken: env.ACTIVE_TOKEN ? env.ACCESS_TOKEN : 'secret2',
  accessToken: env.ACCESS_TOKEN ? env.ACCESS_TOKEN : 'secret2',
  refreshToken: env.REFRESH_TOKEN ? env.REFRESH_TOKEN : 'secret3',
};

export const port = env.PORT ? env.PORT : 4000;

export const urlClient = env.URL_CLIENT ? env.URL_CLIENT : 'http://localhost:3000';
