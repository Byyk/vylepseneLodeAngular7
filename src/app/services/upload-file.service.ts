import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';

export interface Uploding {
    imgRef: AngularFireStorageReference;
    uploadingPromise: Promise<any>;
}

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {
  constructor(
      public afStorage: AngularFireStorage,
      public afa: AngularFireAuth
  ) { }
  uploadFile(event){
      const filePath = `/users/${this.afa.auth.currentUser.uid}/profileImage.jpg`;
      const ref = this.afStorage.ref(filePath);
      const uploadingPromise = this.afStorage.upload(filePath, event.target.files[0]);
      return { imgRef: ref, uploadingPromise: uploadingPromise};
  }
}
