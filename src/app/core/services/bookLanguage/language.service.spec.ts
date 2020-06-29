import { TestBed } from '@angular/core/testing';

import { BookLanguageService } from './language';

describe('LanguageService', () => {
  let service: BookLanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookLanguageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
