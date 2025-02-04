import { Component } from '@angular/core';
import {ConverterFormComponent} from './converter-form/converter-form.component';

@Component({
  selector: 'app-converter',
  imports: [
    ConverterFormComponent
  ],
  templateUrl: './converter.component.html',
  styleUrl: './converter.component.scss'
})
export class ConverterComponent {

}
