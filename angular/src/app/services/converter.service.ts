import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {JobStatus, QueueResponse} from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ConverterService {
  private BASE_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  putMp4FileIntoQueue(formData: FormData): Observable<QueueResponse> {
    return this.http.post<QueueResponse>(`${this.BASE_URL}/convert`, formData);
  }

  getMp4FileStatus(jobId: number): Observable<JobStatus> {
    return this.http.get<JobStatus>(`${this.BASE_URL}/status/${jobId}`);
  }
}
