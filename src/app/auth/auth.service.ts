import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {BehaviorSubject, catchError, Observable, tap, throwError} from "rxjs";
import {User} from "./user.model";
import {Router} from "@angular/router";

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean
}

@Injectable({providedIn: 'root'})
export class AuthService {

  user = new BehaviorSubject<User>(null);
  private readonly USER_DATA = 'userData';
  private expirationTimer: number;

  constructor(private http: HttpClient, private router: Router) {
  }

  public signup(email: string, password: string): Observable<AuthResponseData>{
    return this.http.post<AuthResponseData>(environment.firebaseUrl + 'accounts:signUp', {
      email: email,
      password: password,
      returnSecureToken: true
    }, {params: {'key': environment.firebaseApiKey}})
      .pipe(catchError(this.handleError), tap(resData => {
        this.handleAuthentication(resData);
      }));
  }

  private handleAuthentication(resData: AuthResponseData): void {
    const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
    const user = new User(resData.email, resData.localId, resData.idToken, expirationDate);
    this.user.next(user);
    this.autoLogout(+resData.expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  public login(email: string, password: string): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>(
      environment.firebaseUrl + 'accounts:signInWithPassword',
      {
        email: email,
        password: password,
        returnSecureToken: true
      },
      {params: {key: environment.firebaseApiKey}})
      .pipe(catchError(this.handleError), tap(resData => {
        this.handleAuthentication(resData);
      }));
  }

  public autoLogin(): void {
    const userData: {email: string, id: string, _token: string, _tokenExpirationDate: string} = JSON.parse(localStorage.getItem(this.USER_DATA));
    if (!userData) {
      return;
    }
    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  public autoLogout(expirationDuration: number) {
    this.expirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  public logout(): void {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem(this.USER_DATA);
    if (this.expirationTimer) {
      clearTimeout(this.expirationTimer);
    }
    this.expirationTimer = null;
  }

  private handleError(errorRes: HttpErrorResponse): Observable<AuthResponseData> {
    let errorMessage = 'Unknown error';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(() => new Error(errorMessage));
    }
    switch (errorRes.error.error.message) {
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
    return throwError(() => new Error(errorMessage));
  }
}
