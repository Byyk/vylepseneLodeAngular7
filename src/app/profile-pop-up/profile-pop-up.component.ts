import { Component, OnInit } from '@angular/core';
import {LoginService} from "../services/login.service";
import {faCog} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-profile-pop-up',
  templateUrl: './profile-pop-up.component.html',
  styleUrls: ['./profile-pop-up.component.scss']
})
export class ProfilePopUpComponent implements OnInit {
  faConsfig = faCog;

  constructor(
      public ls: LoginService
  ) { }

  ngOnInit() {
  }

}
