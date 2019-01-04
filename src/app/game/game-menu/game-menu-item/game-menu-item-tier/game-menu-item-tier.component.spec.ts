import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameMenuItemTierComponent } from './game-menu-item-tier.component';

describe('GameMenuItemTierComponent', () => {
  let component: GameMenuItemTierComponent;
  let fixture: ComponentFixture<GameMenuItemTierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameMenuItemTierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameMenuItemTierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
