import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
import { NlpAnalysisResult } from '../models/NlpAnalysisResult'
import { Http } from '@angular/http/'
import { resetFakeAsyncZone } from '@angular/core/testing';

@Injectable()
export class NlpAnalysisService {
  private analysis: NlpAnalysisResult
  private results: Subject<NlpAnalysisResult>

  constructor(protected http: Http) {
    this.results = new Subject()
  }
  runAnalysis(text: string, query = false) {
    if (query) {
      this.http.get(`http://localhost:5000/api/query/--debug/${text}`).subscribe(response => {
        this.loadResults(response, text)
      })
    } else {
      this.http.get(`http://localhost:5000/api/statement/--debug/${text}`).subscribe(response => {
        this.loadResults(response, text)
      })
    }
  }

  addSentence(text: string) {
    this.http.get(`http://localhost:5000/api/statement/${text}`).subscribe(response => {
      // do stuff here
    })
  }

  loadResults(response, text) {
    console.log(response.json())
    const result = new NlpAnalysisResult
    const json = response.json()
    if (json.hasOwnProperty('svgs')) {
      result.dep_graph = json.svgs[0]
      result.ent_graph = json.svgs[1]
    }
    if (json.hasOwnProperty('dependencies')) {
      result.dependencies = json.dependencies
    }
    if (json.hasOwnProperty('lexicon')) {
      result.lexicon = json.lexicon
    }
    if (json.hasOwnProperty('svos')) {
      result.svos = json.svos
    }
    if (json.hasOwnProperty('is_question')) {
      result.is_question = json.is_question
    }
    if (json.ideas) {
      result.ideas = json.ideas
    }
    if (json.hasOwnProperty('answer')) {
      result.answer = json.answer
    }
    result.text = text
    this.results.next(result)
  }

  getAnalysisObservable(): Observable<NlpAnalysisResult> {
    return this.results.asObservable()
  }
}
