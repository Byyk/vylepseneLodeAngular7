import { TestBed } from '@angular/core/testing';

import { MatchChatService } from './match-chat.service';

describe('MatchChatService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MatchChatService = TestBed.get(MatchChatService);
    expect(service).toBeTruthy();
  });
});
