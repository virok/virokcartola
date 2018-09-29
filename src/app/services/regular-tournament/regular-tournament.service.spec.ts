import { TestBed, inject } from '@angular/core/testing';

import { RegularTournamentService } from './regular-tournament.service';

describe('RegularTournamentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RegularTournamentService]
    });
  });

  it('should be created', inject([RegularTournamentService], (service: RegularTournamentService) => {
    expect(service).toBeTruthy();
  }));
});
