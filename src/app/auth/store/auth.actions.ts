import {Action} from "@ngrx/store";

export const LOGIN_START = '[Auth] Login Start ';
export const AUTHENTICATE = 'AUTHENTICATE';
export const AUTHENTICATE_FAIL = 'AUTHENTICATE_FAIL';
export const AUTHENTICATE_AUTO = 'AUTHENTICATE_AUTO';
export const LOGOUT = 'LOGOUT';
export const SIGNUP_START = 'SIGNUP_START';

export class Authenticate implements Action {
  readonly type = AUTHENTICATE;

  constructor(public payload: { email: string, id: string, token: string, expirationDate: Date }) {
  }
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class LoginStart implements Action {
  readonly type = LOGIN_START;

  constructor(public payload: { email: string, password: string }) {
  }
}

export class AuthenticateFail implements Action {
  readonly type = AUTHENTICATE_FAIL;

  constructor(public payload: string) {
  }
}

export class SignupStart implements Action {
  readonly type = SIGNUP_START;

  constructor(public payload: { email: string, password: string }) {
  }
}

export class AuthenticateAuto implements Action {
  readonly type = AUTHENTICATE_AUTO;
}

export type AuthType = Authenticate | Logout | LoginStart | AuthenticateFail| SignupStart | AuthenticateAuto;
