import {
  ChangeDetectionStrategy,
  Component,
  computed, ElementRef,
  inject,
  signal,
  Signal,
  viewChild,
  WritableSignal
} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {ConverterService} from '../../../services/converter.service';
import {interval, Observable, Subject, switchMap, takeUntil, timer} from 'rxjs';
import {JobStatus} from '../../../interfaces';

@Component({
  selector: 'app-converter-form',
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './converter-form.component.html',
  styleUrl: './converter-form.component.scss',
  providers: [ConverterService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConverterFormComponent {
  httpService: ConverterService = inject(ConverterService);
  pollingTimeMs: number = 5 * 60 * 1000;
  pollingIntervalMs: number = 5 * 1000;
  mp4File: WritableSignal<Blob | null> = signal(null);
  isFileValid: Signal<boolean> = computed(() => this.mp4File() !== null);
  isConvertingInProgress: WritableSignal<boolean> = signal(false);
  mp4FileInput: Signal<ElementRef<HTMLInputElement> | undefined> = viewChild('mp4FileInput');
  linkToDownload: WritableSignal<string | null> = signal(null);

  onFileChange(): void {
    const mp4fileInput = this.mp4FileInput()?.nativeElement;

    if (mp4fileInput?.files && mp4fileInput.files.length > 0) {
      this.mp4File.update(() => mp4fileInput.files?.[0] || null);
    }
  }

  onConvertButtonClick(): void {
    if (!this.isFileValid) {
      return;
    }

    const stopPolling$ = new Subject<void>();
    const formData = new FormData();
    formData.append('file', this.mp4File() as any);
    this.isConvertingInProgress.update(() => true);

    this.runConverting(formData, stopPolling$)
      .subscribe(({ status, url }) => {
        if (status === 'done') {
          // @ts-ignore
          this.mp4FileInput().nativeElement.value = '';
          this.isConvertingInProgress.update(() => false);
          this.linkToDownload.update(() => url);
          this.mp4File.update(() => null);
          stopPolling$.next();
        }
      });
  }

  private runConverting(
    formData: FormData, stopPolling$: Subject<void>
  ): Observable<JobStatus> {
    return this.httpService.putMp4FileIntoQueue(formData)
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
      );
  }
}
