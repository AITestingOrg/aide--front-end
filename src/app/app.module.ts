import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, Routes } from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MdButtonModule,
  MdCheckboxModule,
  MdInputModule,
  MdTableModule,
  MdSelectModule,
  MdAutocompleteModule,
  MdTooltipModule,
  MdSortModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CdkTableModule, DataSource} from '@angular/cdk';
import 'hammerjs';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { SearchComponent } from './components/layout/header/search/search.component';
import { NavigationComponent } from './components/layout/header/navigation/navigation.component';
import { NlpAnalysisComponent } from './components/pages/nlp-analysis/nlp-analysis.component';
import { SeedRulesComponent } from './components/pages/seed-rules/seed-rules.component';
import { NlpAnalysisService } from 'app/services/nlp-analysis.service'
import { HttpModule } from '@angular/http';
import { SanitizeHtmlPipe } from './pipes/sanitize-html.pipe'

const appRoutes: Routes = [
  { path: 'debug', component: NlpAnalysisComponent },
  { path: 'seed-rules', component: SeedRulesComponent },
  { path: '**', component: SeedRulesComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SearchComponent,
    NavigationComponent,
    NlpAnalysisComponent,
    SeedRulesComponent,
    SanitizeHtmlPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MdButtonModule,
    MdCheckboxModule,
    MdInputModule,
    MdTableModule,
    MdTooltipModule,
    CdkTableModule,
    MdSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MdAutocompleteModule,
    MdSortModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    HttpModule,
    CommonModule
  ],
  providers: [NlpAnalysisService, SanitizeHtmlPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
