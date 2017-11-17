import { Component, OnInit } from '@angular/core';
import { NlpAnalysisService } from '../../../services/nlp-analysis.service'
import { NlpAnalysisResult } from 'app/models/NlpAnalysisResult';

@Component({
  selector: 'app-nlp-analysis',
  templateUrl: './nlp-analysis.component.html',
  styleUrls: ['./nlp-analysis.component.scss']
})
export class NlpAnalysisComponent implements OnInit {
  private noAction = true
  private results: NlpAnalysisResult
  constructor(protected nlpAnlysisService: NlpAnalysisService) { }

  ngOnInit() {
    this.nlpAnlysisService.getAnalysisObservable().subscribe(result => {
      this.results = result
      this.noAction = false
    })
  }

}
