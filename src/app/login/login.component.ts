import { LoginService } from '../services/login.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { BreakpointObserver} from '@angular/cdk/layout';
import { Breakpointy} from "../model/breakpoints.model";
import { UserModel } from '../model/user.model';

import * as formGroups from './formGroups';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends Breakpointy implements OnInit {
    RGroup: FormGroup;
    RPGroup: FormGroup;
    user: UserModel;
    loginButtonClicked = false;
    GoogleLoginClicked = false;
    FacebookLoginClicked = false;
    loginError = false;

    public step: number;

    constructor(
        public LService: LoginService,
        public fb: FormBuilder,
        public breakpointObserver: BreakpointObserver,
        private router: Router,
        private route: ActivatedRoute,)
    {
        super(breakpointObserver);
        this.user = new UserModel();
        this.RGroup = formGroups.RegistrationFormGroup(fb);
        this.RPGroup = formGroups.ResetPasswordFormGroup(fb);
        this.route.queryParams.subscribe(params => {
            this.RPGroup.get('code').setValue(params['oobCode']);
            this.step = isNaN(params['step']) ? 0 : Number.parseInt(params['step'], 10);
            if (params['oobCode'] !== null) this.step = 3;
        });
    }

    setStep(step: number) {
        if (step === this.step) return;
        this.step = step;
        const quarryParams = Object.assign({}, this.route.snapshot.queryParams);
        quarryParams['step'] = step;
        return this.router.navigate(['/Login'], {queryParams: quarryParams});
    }

    confirmReset() {
        return this.LService.confirmReset(
            this.RPGroup.get('code').value,
            this.RPGroup.get('password').value
        );
    }

    register() {
        if (!this.RGroup.valid) return;
        return this.LService.register(
            formGroups.getFormGroupFieldValue('email', this.RGroup),
            formGroups.getFormGroupFieldValue('password', this.RGroup)
        );
    }

    login() {
        if ( this.user.email === '' && this.user.password === '')
            return;

        this.loginButtonClicked = true;
        this.LService.login(this.user.email, this.user.password)
            .then(() => {
                this.router.navigate(['']);
            })
            .catch(() => {
                this.loginButtonClicked = false;
                this.loginError = true;
            });
    }

    ngOnInit() {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.route.queryParams.subscribe(res => {
                    const step = Number.parseInt(res['step'], 10);
                    this.step = !isNaN(step) ? step : 0;
                });
            }
        });
        this.step = 0;
        this.LService.afa.user.subscribe((user) => {
           if(user) return this.router.navigate(['./profile']);
        });
    }

    resetPassword =      () => this.LService.resetPassword(this.user.resetEmail).then(() => this.setStep(3));
    loginWhitFacebook =  () => this.LService.loginWithFacebook();
    loginWhitGoogle =    () => this.LService.loginWithGoogle();
    emailRequired =      () : boolean => this.RGroup.get('email').hasError('required');
    emailNotValid =      () : boolean => this.RGroup.get('email').hasError('email') && !this.RGroup.get('email').hasError('required');
    passwordRequired =   () : boolean => this.RGroup.get('password').hasError('required');
    passwordLength =     () : boolean => this.RGroup.get('password').hasError('minlength');
    repasswordRequired = () : boolean => this.RGroup.get('repassword').hasError('required');
    passwordsDontMatch = (): boolean => this.RGroup.get('repassword').hasError('passwordNoMatch') && !this.RGroup.get('repassword').hasError('required');
}
