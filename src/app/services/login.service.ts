import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { auth } from 'firebase';
import {NameGroup} from "../model/nameGroup.model";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private logginedIn: boolean;
  get LogginedIn(): boolean{
      return this.logginedIn;
  }

  constructor(
    public afa: AngularFireAuth,
    public afs: AngularFirestore
    ) {
      this.afa.user.subscribe((res) => {
          this.logginedIn = res !== null;
      });
  }

  public editDisplayName(name: NameGroup){
      return this.afa.auth.currentUser.updateProfile({
          displayName: `${name.FirstName} ${name.LastName}`,
          photoURL: this.afa.auth.currentUser.photoURL
      });
  }

  public editProfileImage(imageUrl: string) {
      return this.afa.auth.currentUser.updateProfile({
         displayName: this.afa.auth.currentUser.displayName,
         photoURL:  imageUrl
      });
  }

  public loginWithGoogle = () => this.afa.auth.signInWithPopup(new auth.GoogleAuthProvider());
  public loginWithFacebook = () => this.afa.auth.signInWithPopup(new auth.FacebookAuthProvider());
  public login = (email: string, password: string) => this.afa.auth.signInWithEmailAndPassword(email, password);
  public getUserObservable = () => this.afa.user;
  public resetPassword = (email: string) => this.afa.auth.sendPasswordResetEmail(email);
  public confirmReset = (code: string, password : string) => this.afa.auth.confirmPasswordReset(code, password);
  public register = (email: string, password: string) => this.afa.auth.createUserWithEmailAndPassword(email, password);
  public logout = () => this.afa.auth.signOut();
}
