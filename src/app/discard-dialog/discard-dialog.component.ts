import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {LoginService} from "../services/login.service";
import {DiscardDialogData} from "./interfaces";

@Component({
  selector: 'app-discard-dialog',
  templateUrl: './discard-dialog.component.html',
  styleUrls: ['./discard-dialog.component.css']
})
export class DiscardDialogComponent{

  constructor(
      public dialogRef: MatDialogRef<DiscardDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DiscardDialogData,
      public ls: LoginService
  ) { }

  discard = () => this.dialogRef.close(true);
  storno = () => this.dialogRef.close(false);

  save(){
    this.dialogRef.close(true);
    if(this.data.name.changed) this.ls.editDisplayName(this.data.name);
  }
}
