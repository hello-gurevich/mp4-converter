import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ConverterComponent} from './components/converter/converter.component';

@Component({
  selector: 'app-root',
  imports: [ConverterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'MP4 converter';
}
