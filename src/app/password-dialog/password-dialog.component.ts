import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-password-dialog',
  templateUrl: './password-dialog.component.html',
  styleUrls: ['./password-dialog.component.scss']
})
export class PasswordDialogComponent implements OnInit {

  public password: string;

  constructor(
      private dialogRef: MatDialogRef<PasswordDialogComponent>
  ) { }

  ngOnInit() {
  }

  potvrzeno(){
    this.dialogRef.close(this.password);
  }

}
