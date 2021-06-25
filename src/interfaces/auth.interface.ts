export interface INewUser {
  name: string;
  account: string;
  password: string;
}

export interface IGgPayload {
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
}
