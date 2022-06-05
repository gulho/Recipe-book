import {Actions, createEffect, ofType} from "@ngrx/effects";

import * as AuthActions from "./auth.actions";
import {catchError, map, of, switchMap, tap} from "rxjs";
import {environment} from "../../../environments/environment";
import {AuthResponseData} from "../auth.service";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";

const handleAuthentication = (email: string, localId: string, idToken: string, expiresIn: number) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
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
          map(resData => handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)),
          catchError(error => handleError(error))
        )
      })
    );
  });

  authSuccess = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.AUTHENTICATE, AuthActions.LOGOUT),
      tap(() => this.router.navigate(['/auth']))
    );
  }, {dispatch: false});

  constructor(private actions$: Actions, private http: HttpClient, private router: Router) {
  }
}
