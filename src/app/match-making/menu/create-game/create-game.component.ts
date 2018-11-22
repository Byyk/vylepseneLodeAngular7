import { MatchMakingService } from "../../../services/match-making.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.css']
})
export class CreateGameComponent implements OnInit {
  public modifiers: string[];
  public needpassword: boolean;

  createButtonDisabled;

  public formGroup: FormGroup;

  constructor(
      public afa: AngularFireAuth,
      public mms: MatchMakingService,
      private fb:  FormBuilder
  ) {
    this.modifiers = ['Veřejná', 'Privátní', 'Jen na pozvání'];
    this.needpassword = false;
    this.formGroup = this.fb.group({
        RoomName:  [this.afa.auth.currentUser.displayName + ' - room', Validators.required],
        GroupType: ['Veřejná', Validators.required],
        Password: ['ja jsem heslo :)', [Validators.required, Validators.minLength(4)]]
      });
  }

  ngOnInit() {
  }

  createGame(){
    const roomName = this.formGroup.get('RoomName').value;
    const groupType = this.formGroup.get('GroupType').value;
    const password = groupType === 'Veřejná' ? this.formGroup.get('Password').value : '';

    this.mms.createMatch(roomName, password, groupType, () => this.createButtonDisabled = false);
    this.createButtonDisabled = true;
  }

  typeSelectChanged($event){
    const control = this.formGroup.get('Password');
    this.formGroup.get('GroupType').setValue($event);
    if($event === 'public') control.enable();
    if($event === 'private' || $event.value === 'invate only') control.disable();
  }
}

