import { TestBed, inject } from '@angular/core/testing';

import { TournamentFactoryService } from './tournament-factory.service';

describe('TournamentFactoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TournamentFactoryService]
    });
  });

  it('should be created', inject([TournamentFactoryService], (service: TournamentFactoryService) => {
    expect(service).toBeTruthy();
  }));
});
