import {LoginService} from '../services/login.service';
import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';

import {BreakpointObserver} from '@angular/cdk/layout';
import {Breakpointy} from '../model/breakpoints.model';
import {UserModel} from '../model/user.model';
import {animate, sequence, state, style, transition, trigger} from '@angular/animations';


import * as formGroups from './formGroups';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [
        trigger('hideShow', [
            state('hiddenLeft', style({
                left: '0',
                transform: 'translate(-100%, -50%)'
            })),
            state('shown', style({
                left: '50%',
                transform: 'translate(-50%, -50%)'
            })),
            state('hiddenRight', style({
                left: '100%',
                transform: 'translate(0, -50%)'
            })),
            state('imageMoveLeft', style({
                left: '0'
            })),
            state('imageMoveCenter', style({
                left: '-100px'
            })),
            state('imageMoveRight', style({
                left: '-200px'
            })),
            transition('imageMoveLeft <=> imageMoveCenter', [
                animate('0.3s')
            ]),
            transition('imageMoveRight <=> imageMoveCenter', [
                animate('0.3s')
            ]),
            transition('shown <=> hiddenRight', [
                animate('0.3s')
            ]),
            transition('shown <=> hiddenLeft', [
                animate('0.3s')
            ])
        ])
    ]
})
export class LoginComponent extends Breakpointy implements OnInit {
    RGroup: FormGroup;
    user: UserModel;
    loginButtonClicked = false;
    GoogleLoginClicked = false;
    FacebookLoginClicked = false;
    loginError = false;

    loginDisabledLeft = false;
    registerDisabled = true;
    resetDiabled = true;

    public loginState = 'shown';
    public registerState = 'hiddenLeft';
    public resetState = 'hiddenRight';
    public imageState = 'imageMoveCenter';

    LoginRegisterToggle(prepinac: boolean) {
        this.loginState = prepinac ? 'hiddenRight' : 'shown';
        this.imageState = prepinac ? 'imageMoveLeft' : 'imageMoveCenter'
        this.registerState = prepinac ? 'shown' : 'hiddenLeft';
        setTimeout(() => this.registerDisabled = !prepinac, !prepinac ? 300 : 0);
        setTimeout(() => this.loginDisabledLeft = prepinac, prepinac ? 300 : 0);
    }

    LoginResetToggle(prepinac: boolean) {
        this.loginState = prepinac ? 'hiddenLeft' : 'shown';
        this.imageState = prepinac ? 'imageMoveRight' : 'imageMoveCenter';
        this.resetState = prepinac ? 'shown' : 'hiddenRight';
        setTimeout(() => this.resetDiabled = !prepinac, !prepinac ? 300 : 0);
        setTimeout(() => this.loginDisabledLeft = prepinac, prepinac ? 300 : 0);
    }

    constructor(
        public LService: LoginService,
        public fb: FormBuilder,
        public breakpointObserver: BreakpointObserver,
        private router: Router
    ) {
        super(breakpointObserver);
        this.user = new UserModel();
        this.RGroup = formGroups.RegistrationFormGroup(fb);
    }

    register() {
        if (!this.RGroup.valid) return;
        return this.LService.register(
            formGroups.getFormGroupFieldValue('email', this.RGroup),
            formGroups.getFormGroupFieldValue('password', this.RGroup)
        );
    }

    login() {
        if (this.user.email === '' && this.user.password === '')
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
        this.LService.afa.user.subscribe((user) => {
            if (user) return this.router.navigate(['./matchmaking']); // TODO Defaultni route pri prihlaseni
        });
    }

    resetPassword = () => this.LService.resetPassword(this.user.resetEmail).then(() => this.router.navigate(['/resetpassword']));
    loginWhitFacebook = () => this.LService.loginWithFacebook();
    loginWhitGoogle = () => this.LService.loginWithGoogle();
    loginWhitTwitter = () => this.LService.loginWithTwitter();

    // Registrace

    register_emailRequired = (): boolean => this.RGroup.get('email').hasError('required');
    register_emailNotValid = (): boolean => this.RGroup.get('email').hasError('email') && !this.RGroup.get('email').hasError('required');
    register_passwordRequired = (): boolean => this.RGroup.get('password').hasError('required');
    register_passwordLength = (): boolean => this.RGroup.get('password').hasError('minlength');
    register_rePasswordRequired = (): boolean => this.RGroup.get('rePassword').hasError('required');
    register_passwordsDontMatch = (): boolean => this.RGroup.get('rePassword').hasError('passwordNoMatch') && !this.RGroup.get('rePassword').hasError('required');
    register_nickLength = (): boolean => this.RGroup.get('nick').hasError('minlength');
}
