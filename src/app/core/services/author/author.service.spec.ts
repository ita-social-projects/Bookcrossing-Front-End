import { TestBed } from '@angular/core/testing';

import { AuthorService } from 'src/app/core/services/author/authors.service';

describe('BooksService', () => {
  let service: AuthorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
