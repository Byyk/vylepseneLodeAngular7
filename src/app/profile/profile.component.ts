import { BreakpointObserver } from '@angular/cdk/layout';
import { LoginService } from '../services/login.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'firebase';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CanComponentDeactivate } from "../guards/can-deactivate.guard";
import { MatDialog } from "@angular/material";
import { DiscardDialogComponent } from "../discard-dialog/discard-dialog.component";
import { Breakpointy } from "../model/breakpoints.model";
import { NameGroup } from "../model/nameGroup.model";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent extends Breakpointy implements OnInit, CanComponentDeactivate {
  private user: User;
  private changed = false;
  nameGroup = new NameGroup();

  public  SaveButtonClicked: boolean;

  constructor(
    public LService: LoginService,
    public breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
  ){
      super(breakpointObserver);
  }

  ngOnInit() {
    this.LService.getUserObservable().subscribe(res => {
      this.user = res;
      const names = this.user.displayName.split(' ', 2);
      this.nameGroup.FirstName = names[0];
      this.nameGroup.LastName = names[1];
    });
  }

  canDeactivate() :  Observable<boolean> | boolean{
    if(!this.changed) return true;
      const dialog = this.dialog.open(
          DiscardDialogComponent,
          {
              width: '400px',
              data: {
                  name: this.nameGroup
              }});
      return dialog.afterClosed().pipe(map(res => res));
    }

  public profileChanged() {
    this.nameGroup.changed = true;
    this.changed = true;
  }
  public Save(){
      this.save(() => {
          this.changed = this.nameGroup.changed = this.SaveButtonClicked = false;
      });
  }
  public SetChange = (value: boolean) => this.changed = value && this.nameGroup.changed;
  private save(callback: () => void){
      this.saveName(callback);
      this.SaveButtonClicked = true;
  }
  private saveName = (callback: () => void) => this.LService.editDisplayName(this.nameGroup).then(callback);
}


