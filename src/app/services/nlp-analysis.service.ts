import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
import { NlpAnalysisResult } from '../models/NlpAnalysisResult'
import { Http } from '@angular/http/'

@Injectable()
export class NlpAnalysisService {
  private analysis: NlpAnalysisResult
  private results: Subject<NlpAnalysisResult>

  constructor(protected http: Http) {
    this.results = new Subject()
  }
  runAnalysis(text: string) {
    this.http.get(`http://localhost:5000/api/query/${text}`).subscribe(response => {
      const result = new NlpAnalysisResult
      const json = response.json()
      result.dep_graph = json.svgs[0]
      result.ent_graph = json.svgs[1]
      result.dependencies = json.dependencies
      result.lexicon = json.lexicon
      result.svos = json.svos
      this.results.next(result)
    })
  }

  getAnalysisObservable(): Observable<NlpAnalysisResult> {
    return this.results.asObservable()
  }
}
