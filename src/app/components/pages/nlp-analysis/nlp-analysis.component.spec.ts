import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NlpAnalysisComponent } from './nlp-analysis.component';

describe('NlpAnalysisComponent', () => {
  let component: NlpAnalysisComponent;
  let fixture: ComponentFixture<NlpAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NlpAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NlpAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
