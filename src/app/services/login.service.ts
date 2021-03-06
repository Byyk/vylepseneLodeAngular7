import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {auth} from 'firebase';
import {NameGroup} from '../model/nameGroup.model';
import {Hrac} from '../model/hrac.model';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    private _userLoaded = new BehaviorSubject<boolean>(false);
    public userloaded: Observable<boolean>;
$
    public userDataObservable: Observable<Hrac>;
    public userData: Hrac;
    public static _userData: Hrac;

    private logginedIn: boolean;

    get LogginedIn(): boolean {
        return this.logginedIn;
    }

    constructor(
        public afa: AngularFireAuth,
        public afs: AngularFirestore,
    ) {
        this.userloaded = this._userLoaded.asObservable();

        this.afa.user.subscribe((res) => {
            this.logginedIn = res !== null;
            if (this.logginedIn) {
                this.userDataObservable = this.afs.doc<Hrac>(`Users/${res.uid}`).valueChanges();
                this.userDataObservable.subscribe((userData) => {
                    this.userData = userData;
                    LoginService._userData = userData;
                    if(userData != null)
                        this._userLoaded.next(true);
                });
            } else {
                this._userLoaded.next(false);
            }
        });

        this.afa.auth.onAuthStateChanged(user => {
            if (user === null) this.logginedIn = false;
            else this.logginedIn = true;
        });
    }

    public editDisplayName(name: NameGroup) {
        return this.afa.auth.currentUser.updateProfile({
            displayName: `${name.FirstName} ${name.LastName}`,
            photoURL: this.afa.auth.currentUser.photoURL
        });
    }

    public editProfileImage(imageUrl: string) {
        return this.afa.auth.currentUser.updateProfile({
            displayName: this.afa.auth.currentUser.displayName,
            photoURL: imageUrl
        });
    }

    public loginWithGoogle = () => this.afa.auth.signInWithPopup(new auth.GoogleAuthProvider());
    public loginWithFacebook = () => this.afa.auth.signInWithPopup(new auth.FacebookAuthProvider());
    public loginWithTwitter = () => this.afa.auth.signInWithPopup(new auth.TwitterAuthProvider());
    public login = (email: string, password: string) => this.afa.auth.signInWithEmailAndPassword(email, password);
    public getUserObservable = () => this.afa.user;
    public resetPassword = (email: string) => this.afa.auth.sendPasswordResetEmail(email);
    public confirmReset = (code: string, password: string) => this.afa.auth.confirmPasswordReset(code, password);
    public register = (email: string, password: string) => this.afa.auth.createUserWithEmailAndPassword(email, password);
    public logout = () => this.afa.auth.signOut();
}
