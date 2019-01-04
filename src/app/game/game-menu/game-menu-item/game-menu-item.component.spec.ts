import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameMenuItemComponent } from './game-menu-item.component';

describe('GameMenuItemComponent', () => {
  let component: GameMenuItemComponent;
  let fixture: ComponentFixture<GameMenuItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameMenuItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
