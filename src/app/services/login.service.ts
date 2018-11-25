import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { auth } from 'firebase';
import {NameGroup} from "../model/nameGroup.model";
import {Hrac} from '../model/hrac.model';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
    public userDataObservable: Observable<Hrac>;
    public userData: Hrac;

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
          if(this.logginedIn){
              this.userDataObservable = this.afs.collection<Hrac>('Users', ref => ref.where('uid', '==', res.uid)).valueChanges()
                  .pipe(map((user) => user[0]));
              this.userDataObservable.subscribe((userData) => this.userData = userData);
          }
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
  public loginWithTwitter = () => this.afa.auth.signInWithPopup(new auth.TwitterAuthProvider());
  public login = (email: string, password: string) => this.afa.auth.signInWithEmailAndPassword(email, password);
  public getUserObservable = () => this.afa.user;
  public resetPassword = (email: string) => this.afa.auth.sendPasswordResetEmail(email);
  public confirmReset = (code: string, password : string) => this.afa.auth.confirmPasswordReset(code, password);
  public register = (email: string, password: string) => this.afa.auth.createUserWithEmailAndPassword(email, password);
  public logout = () => this.afa.auth.signOut();
}
