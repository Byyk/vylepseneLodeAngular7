import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VelikostMenuComponent } from './velikost-menu.component';

describe('VelikostMenuComponent', () => {
  let component: VelikostMenuComponent;
  let fixture: ComponentFixture<VelikostMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VelikostMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VelikostMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
