import {User} from "../user.model";

import * as AuthActions from "./auth.actions";

export interface State {
  user: User,
  authError: string,
  loading: boolean
}

const initialState: State = {
  user: null,
  authError: null,
  loading: false
}

export function authReducer(state: State = initialState, action: AuthActions.AuthType) {
  switch (action.type) {
    case AuthActions.AUTHENTICATE:
      const user = new User(action.payload.email, action.payload.id, action.payload.token, action.payload.expirationDate);
      return {
        ...state,
        user,
        authError: null,
        loading: false
      };
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null
      }
    case AuthActions.LOGIN_START:
    case AuthActions.SIGNUP_START:
      return {
        ...state,
        authError: null,
        loading: true
      };
    case AuthActions.AUTHENTICATE_FAIL:
      return {
        ...state,
        user: null,
        authError: action.payload,
        loading: false
      }
    default:
      return state;
  }
}
