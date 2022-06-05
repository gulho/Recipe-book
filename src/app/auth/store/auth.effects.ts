import {Actions, createEffect, ofType} from "@ngrx/effects";

import * as AuthActions from "./auth.actions";
import {catchError, map, of, switchMap, tap} from "rxjs";
import {environment} from "../../../environments/environment";
import {AuthService} from "../auth.service";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {User} from "../user.model";

const USER_DATA = 'userData';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean
}

const handleAuthentication = (email: string, localId: string, idToken: string, expiresIn: number) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const user = new User(email, localId, idToken, expirationDate);
  localStorage.setItem(USER_DATA, JSON.stringify(user));
  return new AuthActions.Authenticate({
    email: email,
    id: localId,
    token: idToken,
    expirationDate: expirationDate
  });
};

const handleError = (error) => {
  let errorMessage = 'Unknown error';
  if (!error.error || !error.error.error) {
    return of(new AuthActions.AuthenticateFail(errorMessage));
  }
  switch (error.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'The email address is already in use by another account.';
      break;
    case 'OPERATION_NOT_ALLOWED':
      errorMessage = 'Password sign-in is disabled for this project.';
      break;
    case 'TOO_MANY_ATTEMPTS_TRY_LATER':
      errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.';
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'There is no user record corresponding to this identifier. The user may have been deleted.';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'The password is invalid or the user does not have a password.';
      break;
    case 'USER_DISABLED':
      errorMessage = 'The user account has been disabled by an administrator.';
      break;
  }
  return of(new AuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {

  authSignup = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.SIGNUP_START),
      switchMap((signupAction: AuthActions.SignupStart) => {
        return this.http.post<AuthResponseData>(
          environment.firebaseUrl + 'accounts:signUp',
          {
            email: signupAction.payload.email,
            password: signupAction.payload.password,
            returnSecureToken: true
          }
        )
        .pipe(
          tap(resData => this.service.setAutoLogoutTimer(+resData.expiresIn * 1000)),
          map(resData => handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)),
          catchError(error => handleError(error))
        )
      })
    );
  });

  authLogin = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.LOGIN_START),
      switchMap((authData: AuthActions.LoginStart) => {
        return this.http.post<AuthResponseData>(
          environment.firebaseUrl + 'accounts:signInWithPassword',
          {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true
          },
          {params: {key: environment.firebaseApiKey}}
        )
        .pipe(
          tap(resData => this.service.setAutoLogoutTimer(+resData.expiresIn * 1000)),
          map(resData => handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)),
          catchError(error => handleError(error))
        )
      })
    );
  });

  authSuccess = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.AUTHENTICATE),
      tap(() => this.router.navigate(['/']))
    );
  }, {dispatch: false});

  authLogout = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.LOGOUT),
      tap(() => {
        this.service.clearLogoutTimer();
        localStorage.removeItem(USER_DATA);
        this.router.navigate(['/']);
      })
    );
  }, {dispatch: false});

  autoLogin = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.AUTHENTICATE_AUTO),
      map(() => {
        const userData: { email: string, id: string, _token: string, _tokenExpirationDate: string } = JSON.parse(localStorage.getItem(USER_DATA));
        if (!userData) {
          return {type: "DUMMY"};
        }
        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
        if (loadedUser.token) {
          const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
          this.service.setAutoLogoutTimer(expirationDuration)
          return new AuthActions.Authenticate({
            email: loadedUser.email,
            id: loadedUser.id,
            token: loadedUser.token,
            expirationDate: new Date(userData._tokenExpirationDate)
          })
        }
        return {type: "DUMMY"};
      })
    );
  });

  constructor(private actions$: Actions, private http: HttpClient, private router: Router, private service: AuthService) {
  }
}
