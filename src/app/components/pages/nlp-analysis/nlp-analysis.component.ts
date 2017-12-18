import { Component, OnInit } from '@angular/core'
import { NlpAnalysisService } from '../../../services/nlp-analysis.service'
import { NlpAnalysisResult } from 'app/models/NlpAnalysisResult'
import { DataSource } from '@angular/cdk'
import { Observable } from 'rxjs/Observable'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

@Component({
  selector: 'app-nlp-analysis',
  templateUrl: './nlp-analysis.component.html',
  styleUrls: ['./nlp-analysis.component.scss']
})
export class NlpAnalysisComponent implements OnInit {
  private noAction = true
  private results: NlpAnalysisResult
  private displayedColumns = []
  private ideaRows = [[]]
  private dataSource: DataSource<any>
  private resultDataSource: NlpResult
  constructor(protected nlpAnlysisService: NlpAnalysisService) { }

  ngOnInit() {
    this.resultDataSource = new NlpResult(this.ideaRows)
    this.dataSource = new NlpDataSource(this.resultDataSource)
    this.nlpAnlysisService.getAnalysisObservable().subscribe(result => {
      this.displayedColumns.length = 0
      console.log('Analysis Service')
      this.ideaRows[0].length = 0
      this.results = result
      for (const key in this.results.answer) {
        if (this.results.answer.hasOwnProperty(key)) {
          this.displayedColumns.push(key)
          this.ideaRows[0][key] = this.results.answer[key].join(', ')
        }
      }
      console.log(this.ideaRows)
      this.resultDataSource.next(this.ideaRows)
      this.noAction = false
      console.log('Analysis Done.')
    })
  }

  getType() {
    return this.results.is_question ? 'Question' : 'Statement'
  }

}

class NlpDataSource extends DataSource<any> {
  constructor(private _results: any) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any> {
    return this._results.dataChange;
  }

  disconnect() {}
}

class NlpResult {
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  get data(): any { return this.dataChange.value; }

  constructor(data) {
    // Fill up the database with 100 users.
    this.dataChange.next(data)
  }

  public next(data: any) {
    this.dataChange.next(data)
  }
}
