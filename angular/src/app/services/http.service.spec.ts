import { TestBed } from '@angular/core/testing';

import { ConverterService } from './converter.service';

describe('HttpService', () => {
  let service: ConverterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConverterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
