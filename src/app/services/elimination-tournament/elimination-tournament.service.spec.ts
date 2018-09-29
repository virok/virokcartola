import { TestBed, inject } from '@angular/core/testing';

import { EliminationTournamentService } from './elimination-tournament.service';

describe('EliminationTournamentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EliminationTournamentService]
    });
  });

  it('should be created', inject([EliminationTournamentService], (service: EliminationTournamentService) => {
    expect(service).toBeTruthy();
  }));
});
