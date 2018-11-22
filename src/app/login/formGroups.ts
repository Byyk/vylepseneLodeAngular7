import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {EmailMatcher, PasswordMatcher} from "../validation/matchers";

export const RegistrationFormGroup = (fb: FormBuilder) => {
    return fb.group({
        email: ['', [Validators.required, EmailMatcher]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        repassword: ['', [Validators.required, PasswordMatcher]]
    });
};

export const ResetPasswordFormGroup = (fb: FormBuilder) => {
    return fb.group({
        code: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        repassword: ['', [Validators.required, PasswordMatcher]]
    });
};

export const getFormGroupFieldValue = (name: string, fg: FormGroup) => fg.get(name).value;
