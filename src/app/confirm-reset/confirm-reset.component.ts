import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ResetPasswordFormGroup} from '../login/formGroups';
import {LoginService} from '../services/login.service';

@Component({
  selector: 'app-confirm-reset',
  templateUrl: './confirm-reset.component.html',
  styleUrls: ['./confirm-reset.component.scss']
})
export class ConfirmResetComponent implements OnInit {
  public RPGroup: FormGroup;


  constructor(
      public route: ActivatedRoute,
      private fb: FormBuilder,
      private ls: LoginService
  ) {
    this.RPGroup = ResetPasswordFormGroup(fb);
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.RPGroup.get('code').setValue(params['oobCode']);
    });
  }

  confirmReset() {
    this.ls.confirmReset(
      this.RPGroup.get('code').value,
      this.RPGroup.get('password').value
    );
  }

  reset_codeRequired = () : boolean => this.RPGroup.get('code').hasError('required');
  reset_passwordRequired = () : boolean => this.RPGroup.get('password').hasError('required');
  reset_passwordLength = () : boolean => this.RPGroup.get('password').hasError('minlength') && !this.RPGroup.get('password').hasError('required');
  reset_rePasswordRequired = () : boolean => this.RPGroup.get('rePassword').hasError('required');
  reset_rePasswordMatch = () : boolean => this.RPGroup.get('rePassword').hasError('passwordNoMatch') && !this.RPGroup.get('rePassword').hasError('required');
}
