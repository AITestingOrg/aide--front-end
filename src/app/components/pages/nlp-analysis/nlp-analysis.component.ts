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
  private columns = {
    relationships: ['Subject', 'Action', 'Things'],
    lexicon: ['Word', 'Coarse-grained-part-of-speech', 'Fine-grained-part-of-speech', 'Part-of-speech-abbr', 'Base-form'],
    svos: ['Thing1', 'Action', 'Thing2'],
    dependencies: ['Word', 'Syntactic-dependency-relation', 'Governor', 'Dependents']
  }
  private results: NlpAnalysisResult
  private relationshipDataSource: DataSource<any>
  private relationshipContainer: NlpResult
  private lexiconDataSource: DataSource<any>
  private lexiconContainer: NlpResult
  private dependenciesDataSource: DataSource<any>
  private dependenciesContainer: NlpResult
  private svoDataSource: DataSource<any>
  private svoContainer: NlpResult
  constructor(protected nlpAnlysisService: NlpAnalysisService) { }

  ngOnInit() {
    this.relationshipContainer = new NlpResult([[]])
    this.relationshipDataSource = new NlpDataSource(this.relationshipContainer)
    this.lexiconContainer = new NlpResult([[]])
    this.lexiconDataSource = new NlpDataSource(this.lexiconContainer)
    this.dependenciesContainer = new NlpResult([[]])
    this.dependenciesDataSource = new NlpDataSource(this.dependenciesContainer)
    this.svoContainer = new NlpResult([[]])
    this.svoDataSource = new NlpDataSource(this.svoContainer)
    this.nlpAnlysisService.getAnalysisObservable().subscribe(result => {
      this.results = result
      console.log('Analysis Service')
      this.relationshipContainer.next(result.ideas)
      this.lexiconContainer.next(result.lexicon)
      this.svoContainer.next(result.svos)
      this.dependenciesContainer.next(result.dependencies)
      this.noAction = false
      console.log('Analysis Done.')
    })
  }

  getType() {
    return this.results.is_question ? 'Question' : this.results.text.split(' ').length > 1 ? 'Statement' : 'Query'
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
    console.log(data)
    this.dataChange.next(data)
  }
}
