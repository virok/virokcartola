import { TestBed, inject } from '@angular/core/testing';

import { TournamentRepositoryService } from './tournament-repository.service';

describe('TournamentRepositoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TournamentRepositoryService]
    });
  });

  it('should be created', inject([TournamentRepositoryService], (service: TournamentRepositoryService) => {
    expect(service).toBeTruthy();
  }));
});
