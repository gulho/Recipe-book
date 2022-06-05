import {Injectable} from "@angular/core";
import {Store} from "@ngrx/store";

import * as fromApp from "../store/app.reducer";
import * as AuthActions from './store/auth.actions';

@Injectable({providedIn: 'root'})
export class AuthService {

  private expirationTimer: number;

  constructor(private store: Store<fromApp.AppState>) {
  }

  public setAutoLogoutTimer(expirationDuration: number) {
    this.expirationTimer = setTimeout(() => {
      this.store.dispatch(new AuthActions.Logout());
    }, expirationDuration);
  }

  public clearLogoutTimer() {
    if (this.expirationTimer) {
      clearTimeout(this.expirationTimer);
      this.expirationTimer = null;
    }
  }
}
