import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthResponseData, AuthService} from "./auth.service";
import {Observable} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit{
  authForm: FormGroup;

  private _isLoginMode = true;
  private _isLoading = false;
  private _error: string = null;

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    this.authForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
  }


  public get isLoginMode(): boolean {
    return this._isLoginMode;
  }


  get isLoading(): boolean {
    return this._isLoading;
  }

  get error(): string {
    return this._error;
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
        console.log(errorMessage);
        this._error = errorMessage;
        this._isLoading = false;
      }
    });
    this.authForm.reset();
  }
}
