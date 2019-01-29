import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameSecondaryMenuItemComponent } from './game-secondary-menu-item.component';

describe('GameSecondaryMenuItemComponent', () => {
  let component: GameSecondaryMenuItemComponent;
  let fixture: ComponentFixture<GameSecondaryMenuItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameSecondaryMenuItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameSecondaryMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
