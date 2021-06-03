export interface ITypeToken {
  activeToken: string;
  accessToken: string;
  refreshToken: string;
}

export interface INewUser {
  name: string;
  account: string;
  password: string;
}

export interface IDecodedToken {
  id?: string;
  newUser?: INewUser;
  iat: number;
  exp: number;
}
