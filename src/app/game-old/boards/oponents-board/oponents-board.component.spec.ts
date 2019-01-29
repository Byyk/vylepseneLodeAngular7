import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OponentsBoardComponent } from './oponents-board.component';

describe('OponentsBoardComponent', () => {
  let component: OponentsBoardComponent;
  let fixture: ComponentFixture<OponentsBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OponentsBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OponentsBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
