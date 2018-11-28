import {AbstractControl} from "@angular/forms";

export const PasswordMatcher = (control: AbstractControl) : {[key: string]: boolean} => {
    if(control.parent === undefined || control.parent === null)
        return null;
    const password = control.parent.get('password');
    const repassword = control.parent.get('rePassword');
    if(!password || !repassword) return null;
    return password.value === repassword.value ? null : { passwordNoMatch: true };
};

export const EmailMatcher = (control: AbstractControl) : {[key: string]: boolean} => {
    const email : string= control.value;
    if(email === '') return null;
    const _pom : string[] = email.split('@');
    if(_pom.length !== 2) return {email: true};
    const _pom2 : string [] = _pom[1].split('.');
    if(_pom2.length < 2) return {email: true};
    return null;
};
