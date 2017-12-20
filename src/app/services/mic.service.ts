import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
const {
  webkitSpeechRecognition,
  SpeechRecognition,
  mozSpeechRecognition,
  msSpeechRecognition,
  oSpeechRecognition
}: IWindow = <IWindow>window

interface IWindow extends Window {
  webkitSpeechRecognition: any
  SpeechRecognition: any
  mozSpeechRecognition: any
  msSpeechRecognition: any
  oSpeechRecognition: any
}

const ABORT = 'ABORT'
const RESET = 'RESET'
const STOP = 'STOP'

@Injectable()
export class MicService {
  private recognition: any
  private listening: boolean
  private pauseAfterDisconnect: boolean
  private interimSubject: BehaviorSubject<string>
  private finalSubject: BehaviorSubject<string>
  private disconnectSubject: Subject<boolean>

  constructor() {
    const BrowserSpeechRecognition =
      SpeechRecognition ||
      webkitSpeechRecognition ||
      mozSpeechRecognition ||
      msSpeechRecognition ||
      oSpeechRecognition

    this.recognition = BrowserSpeechRecognition ? new BrowserSpeechRecognition() : null
    this.listening = false
    this.pauseAfterDisconnect = false

    this.finalSubject = new BehaviorSubject<string>('')
    this.interimSubject = new BehaviorSubject<string>('')
    this.disconnectSubject = new Subject<boolean>()

    if (this.recognition) {
      this.recognition.continuous = true
      this.recognition.interimResults = true
      this.recognition.onresult = this.updateTranscript.bind(this)
      this.recognition.onend = this.onRecognitionDisconnect.bind(this)
    }
  }

  public start() {
    this.recognition.start()
    this.listening = true
  }

  public toggle() {
    if (this.listening) {
      this.disconnect(STOP)
    } else {
      this.start()
    }
  }

  public isListening(): boolean {
    return this.listening
  }

  private supportsBrowserSpeechRecognition() {
    return this.recognition !== null
  }

  disconnect(disconnectType) {
    if (this.recognition) {
      switch (disconnectType) {
        case ABORT:
          this.pauseAfterDisconnect = true
          this.recognition.abort()
          break
        case RESET:
          this.pauseAfterDisconnect = false
          this.recognition.abort()
          break
        case STOP:
        default:
          this.pauseAfterDisconnect = true
          this.recognition.stop()
      }
    }
  }

  onRecognitionDisconnect() {
    this.listening = false
    if (!this.pauseAfterDisconnect) {
      this.startListening()
    }
    this.pauseAfterDisconnect = false
    this.disconnectSubject.next(true)
  }

  updateTranscript(event) {
    let text = ''
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        console.log('Final', event.results[i][0].transcript)
        this.finalSubject.next(this.concatTranscripts(
          this.finalSubject.value,
          event.results[i][0].transcript
        ))
      } else {
        console.log('Interim', event.results[i][0].transcript)
        text = this.concatTranscripts(
          text,
          event.results[i][0].transcript
        )

        if (i === event.results.length - 1) {
          this.interimSubject.next(text)
        }
      }
    }
  }

  concatTranscripts(...transcriptParts): string {
    return transcriptParts.map(t => t.trim()).join(' ').trim()
  }

  resetTranscript() {
    this.interimSubject.next('')
    this.finalSubject.next('')
    this.disconnect(RESET)
  }

  startListening() {
    if (this.recognition && !this.listening) {
      try {
        this.recognition.start()
      } catch (DOMException) {
        // Tried to start recognition after it has already started - safe to swallow this error
      }
      this.listening = true
    }
  }

  abortListening() {
    this.listening = false
    this.disconnect(ABORT)
  }

  stopListening() {
    this.listening = false
    this.disconnect(STOP)
  }

  getFinalObservable(): Observable<string> {
    return this.finalSubject.asObservable()
  }

  getInterimObservable(): Observable<string> {
    return this.interimSubject.asObservable()
  }

  getDisconnectObservable(): Observable<boolean> {
    return this.disconnectSubject.asObservable()
  }
}
