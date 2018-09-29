import { TestBed, inject } from '@angular/core/testing';

import { AddScoreService } from './add-score.service';

describe('AddScoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddScoreService]
    });
  });

  it('should be created', inject([AddScoreService], (service: AddScoreService) => {
    expect(service).toBeTruthy();
  }));
});
