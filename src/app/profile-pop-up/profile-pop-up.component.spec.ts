import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePopUpComponent } from './profile-pop-up.component';

describe('ProfilePopUpComponent', () => {
  let component: ProfilePopUpComponent;
  let fixture: ComponentFixture<ProfilePopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilePopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
