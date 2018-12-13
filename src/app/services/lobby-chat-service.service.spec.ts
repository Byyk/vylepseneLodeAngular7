import { TestBed } from '@angular/core/testing';

import { LobbyChatServiceService } from './lobby-chat-service.service';

describe('LobbyChatServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LobbyChatServiceService = TestBed.get(LobbyChatServiceService);
    expect(service).toBeTruthy();
  });
});
