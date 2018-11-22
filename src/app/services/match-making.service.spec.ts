import { TestBed, inject } from '@angular/core/testing';

import { MatchMakingService } from './match-making.service';

describe('MatchMakingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MatchMakingService]
    });
  });

  it('should be created', inject([MatchMakingService], (service: MatchMakingService) => {
    expect(service).toBeTruthy();
  }));
});
