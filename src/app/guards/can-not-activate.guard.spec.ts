import { TestBed, async, inject } from '@angular/core/testing';

import { CanNotActivateGuard } from './can-not-activate.guard';

describe('CanNotActivateGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanNotActivateGuard]
    });
  });

  it('should ...', inject([CanNotActivateGuard], (guard: CanNotActivateGuard) => {
    expect(guard).toBeTruthy();
  }));
});
