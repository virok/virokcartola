import { TestBed, inject } from '@angular/core/testing';

import { ToasterConfigService } from './toaster-config.service';

describe('ToasterConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToasterConfigService]
    });
  });

  it('should be created', inject([ToasterConfigService], (service: ToasterConfigService) => {
    expect(service).toBeTruthy();
  }));
});
