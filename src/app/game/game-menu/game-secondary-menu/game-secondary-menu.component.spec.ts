import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameSecondaryMenuComponent } from './game-secondary-menu.component';

describe('GameSecondaryMenuComponent', () => {
  let component: GameSecondaryMenuComponent;
  let fixture: ComponentFixture<GameSecondaryMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameSecondaryMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameSecondaryMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
