import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthResponseData, AuthService} from "./auth.service";
import {Observable, Subscription} from "rxjs";
import {Router} from "@angular/router";
import {AlertComponent} from "../shared/alert/alert.component";
import {PlaceholderDirective} from "../shared/placeholder/placeholder.directive";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {
  authForm: FormGroup;
  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;

  private _isLoginMode = true;
  private _isLoading = false;
  private closeSub: Subscription;

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    this.authForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
  }

  ngOnDestroy(): void {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
  }

  public get isLoginMode(): boolean {
    return this._isLoginMode;
  }


  get isLoading(): boolean {
    return this._isLoading;
  }

  public onSwitchMode(): void {
    this._isLoginMode = !this._isLoginMode;
  }

  onSubmit() {
    if (this.authForm.invalid) {
      return;
    }
    const email = this.authForm.get('email').value as string;
    const password = this.authForm.get('password').value as string;
    this._isLoading = true;
    let authObs: Observable<AuthResponseData>;


    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }

    authObs.subscribe({
      next: () => {
        this._isLoading = false;
        this.router.navigate(['/recipes']);
      },
      error: (errorMessage) => {
        this.showErrorAlert(errorMessage);
        this._isLoading = false;
      }
    });
    this.authForm.reset();
  }

  private showErrorAlert(message: string): void {
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();
    const alertRef = this.alertHost.viewContainerRef.createComponent(AlertComponent);
    alertRef.instance.message = message;
    this.closeSub = alertRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    });
  }
}
