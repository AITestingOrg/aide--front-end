import { TestBed, inject } from '@angular/core/testing';

import { NlpAnalysisService } from './nlp-analysis.service';

describe('NlpAnalysisService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NlpAnalysisService]
    });
  });

  it('should be created', inject([NlpAnalysisService], (service: NlpAnalysisService) => {
    expect(service).toBeTruthy();
  }));
});
