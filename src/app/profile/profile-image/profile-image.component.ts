import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {UploadFileService} from "../../services/upload-file.service";
import {LoginService} from "../../services/login.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-profile-image',
  templateUrl: './profile-image.component.html',
  styleUrls: ['./profile-image.component.css']
})
export class ProfileImageComponent implements OnInit {
  public photo: string;
  public uploadingImage: boolean;
  public uploadProgress: Observable<number>;

  set uploadState(value: boolean){
      this.uploadingImage = value;
      this.uploadStateChange.emit(value);
  }

  @Output()
  uploadStateChange = new EventEmitter<boolean>();

  constructor(
      public ufService: UploadFileService,
      public LService: LoginService
  ) { }

  ngOnInit() {
      this.LService.afa.user.subscribe((res) =>{
          this.photo = res.photoURL;
      });
      this.uploadingImage = false;
  }

  uploadProfileImage(event){
      this.uploadState = true;
      // Todo opravit spoždění
      const ref = this.ufService.uploadFile(event);
      this.uploadProgress = ref.uploadingPromise.percentageChanges();

      ref.uploadingPromise.then(() => {
          ref.imgRef.getDownloadURL().subscribe(res => {
              this.photo = res;
              if(this.photo !== this.LService.afa.auth.currentUser.photoURL)
                this.LService.editProfileImage(res);
              this.uploadState = false;
          });
      });
  }
}
