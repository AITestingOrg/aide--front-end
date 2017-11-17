import { Component, OnInit } from '@angular/core'
import { NlpAnalysisService } from '../../../../services/nlp-analysis.service'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  private questionMode = false
  private text: string
  constructor(protected nlpAnlysisService: NlpAnalysisService) { }

  ngOnInit() {
  }

  private toggleSearch(event) {
    this.questionMode = false
  }

  private toggleQuestion(event) {
    this.questionMode = true
  }

  private onKeyDown(event) {
    this.nlpAnlysisService.runAnalysis(this.text)
  }

}
