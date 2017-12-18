import { Component, OnInit } from '@angular/core'
import { NlpAnalysisService } from '../../../../services/nlp-analysis.service'
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
    if (event.key === 'Enter') {
      this.nlpAnlysisService.runAnalysis(this.text)
    }
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
    console.log(window)
    if (window.hasOwnProperty('webkitSpeechRecognition') || window.hasOwnProperty('SpeechRecognition')) {
      console.log('start speech')
      if (this.isRecording) {
        console.log('abort speech')
        this.recognition.stop()
        this.isRecording = false
      } else {
        this.isRecording = true
      if (window.hasOwnProperty('webkitSpeechRecognition')) {
        this.recognition = new webkitSpeechRecognition()
      } else if (window.hasOwnProperty('SpeechRecognition')) {
        this.recognition = new SpeechRecognition();
      }

      this.recognition.continuous = false;
      this.recognition.interimResults = false;

      this.recognition.lang = 'en-US';
      this.recognition.start();

      this.recognition.onresult = (e) => {
        console.log(e.results[0][0].transcript)
        this.text = e.results[0][0].transcript
        this.recognition.stop()
        this.isRecording = false
        console.log('end speech')
        this.nlpAnlysisService.runAnalysis(this.text)
      };

      this.recognition.onerror = function (e) {
        this.recognition.stop()
        this.isRecording = false
      }
    }
    }
  }
}
