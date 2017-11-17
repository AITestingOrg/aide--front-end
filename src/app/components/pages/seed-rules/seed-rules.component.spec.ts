import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeedRulesComponent } from './seed-rules.component';

describe('SeedRulesComponent', () => {
  let component: SeedRulesComponent;
  let fixture: ComponentFixture<SeedRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeedRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeedRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
