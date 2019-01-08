import { TestBed } from '@angular/core/testing';

import { Gs2Service } from './gs2.service';

describe('Gs2Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Gs2Service = TestBed.get(Gs2Service);
    expect(service).toBeTruthy();
  });
});
