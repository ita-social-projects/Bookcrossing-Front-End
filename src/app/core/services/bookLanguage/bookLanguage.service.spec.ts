import { TestBed } from '@angular/core/testing';

import { BookLanguageService } from './bookLanguage.service';

describe('BookLanguageService', () => {
  let service: BookLanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookLanguageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
