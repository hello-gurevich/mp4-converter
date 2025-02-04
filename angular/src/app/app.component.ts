import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ConverterComponent} from './components/converter/converter.component';

@Component({
  selector: 'app-root',
  imports: [ConverterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'MP4 converter';
}
