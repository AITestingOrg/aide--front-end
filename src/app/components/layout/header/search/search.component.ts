import { Component, OnInit } from '@angular/core'
import { NlpAnalysisService } from '../../../../services/nlp-analysis.service'
import { MicService } from '../../../../services/mic.service'
const { webkitSpeechRecognition, SpeechRecognition }: IWindow = <IWindow>window;
interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  private questionMode = false
  private text: string
  private isRecording = false
  private recognition: any
  constructor(protected nlpAnlysisService: NlpAnalysisService, protected micService: MicService) { }

  ngOnInit() {
    this.micService.getInterimObservable().subscribe((text) => {
      if (text && text.length > 0 && text !== '') {
        console.log('Updating Text:', text)
        this.text = text
      }
    })
    this.micService.getFinalObservable().subscribe((text) => {
      if (text && text.length > 0 && text !== '') {
        console.log('Final Text:', text)
        this.text = text
        this.nlpAnlysisService.runAnalysis(text)
      }
    })
    this.micService.getDisconnectObservable().subscribe((disconnected) => {
      this.isRecording = false
    })
  }

  private toggleSearch(event) {
    this.questionMode = false
  }

  private toggleQuestion(event) {
    this.questionMode = true
  }

  private onKeyDown(event) {
    if (event.key === 'Enter') {
      this.nlpAnlysisService.runAnalysis(this.text)
    } else {
      this.nlpAnlysisService.runAnalysis(this.text, true)
    }
  }

  private addSentence(event) {
    this.nlpAnlysisService.addSentence(this.text)
  }

  private classes() {
    if (this.isRecording) {
      return 'aide-header-search recording'
    } else {
      return 'aide-header-search'
    }
  }

  private tooltip() {
    if (this.isRecording) {
      return 'Cancel Recording'
    } else {
      return 'Start Recording'
    }
  }

  private micInput(event) {
    this.micService.toggle()
    if (this.micService.isListening()) {
      this.isRecording = true
    } else {
      this.isRecording = false
    }
  }
}
