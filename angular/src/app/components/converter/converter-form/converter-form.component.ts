import {Component, inject} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {ConverterService} from '../../../services/converter.service';
import {interval, Subject, switchMap, takeUntil, timer} from 'rxjs';

@Component({
  selector: 'app-converter-form',
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './converter-form.component.html',
  styleUrl: './converter-form.component.scss',
  providers: [ConverterService]
})
export class ConverterFormComponent {
  file!: File;
  httpService = inject(ConverterService);
  pollingTimeMs = 5 * 60 * 1000;
  pollingIntervalMs = 5 * 1000;

  onFileChange(e: Event) {
    const mp4fileInput = e.target as HTMLInputElement;
    if (mp4fileInput.files && mp4fileInput.files.length > 0) {
      this.file = mp4fileInput.files[0];
    }
  }

  onConvertButtonClick(): void {
    if (this.file === undefined) {
      return;
    }

    const stopPolling$ = new Subject<void>();

    const formData = new FormData();
    formData.append('file', this.file);

    this.httpService.putMp4FileIntoQueue(formData)
      .pipe(
        switchMap(
          ({ jobId }) => {
            return interval(this.pollingIntervalMs)
              .pipe(
                switchMap(
                  () => this.httpService.getMp4FileStatus(jobId)
                ),
                takeUntil(
                  timer(this.pollingTimeMs)
                ),
                takeUntil(
                  stopPolling$
                )
              )
          }
        )
      )
      .subscribe(({ status, url }) => {
        if (status === 'done') {
          stopPolling$.next();

          console.log(url);
        }
      });
  }
}
