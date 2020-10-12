import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { userUrl, bookUrl } from '../../../configs/api-endpoint.constants';
import { BookService } from './book.service';
import { BookQueryParams } from '../../models/bookQueryParams';
import { IPage } from '../../models/page';
import { IBook } from '../../models/book';
import { bookState } from '../../models/bookState.enum';

// Testing of BookService
describe('#BookService getBookPage,getCurrentOwnedBooks,getRequestedBooks,getReadBooks,getBookById,activateBook,deactivateBook', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let bookService: BookService;

  beforeEach(() => {
    // Configures testing app module
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BookService],
    });

    // Instantaites HttpClient, HttpTestingController and BookService
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    bookService = TestBed.inject(BookService);
  });

  afterEach(() => {
    httpTestingController.verify(); // Verifies that no requests are outstanding.
  });

  // Test case 1
  it('should send BookQueryParams and get Page<IBook>, GET method', () => {
    const queryParams = new BookQueryParams();
    const booksPage: IPage<IBook> = null;

    bookService
      .getBooksPage(queryParams)
      .subscribe(
        (data) => expect(data).toEqual(booksPage, 'should return books page'),
        fail
      );

    // should have made one request to GET
    const req = httpTestingController.expectOne(
      bookUrl + '?page=1&pageSize=10&firstRequest=true'
    );
    expect(req.request.method).toEqual('GET');
  });

  // Test case 2
  it('should send BookQueryParams and get Page<IBook>, GET method', () => {
    const queryParams = new BookQueryParams();
    const booksPage: IPage<IBook> = null;

    bookService
      .getRegisteredBooks(queryParams)
      .subscribe(
        (data) => expect(data).toEqual(booksPage, 'should return books page'),
        fail
      );

    // should have made one request to GET
    const req = httpTestingController.expectOne(
      bookUrl + 'registered?page=1&pageSize=10&firstRequest=true'
    );
    expect(req.request.method).toEqual('GET');
  });

  // Test case 3
  it('should send BookQueryParams and get Page<IBook>, GET method', () => {
    const queryParams = new BookQueryParams();
    const booksPage: IPage<IBook> = null;

    bookService
      .getCurrentOwnedBooks(queryParams)
      .subscribe(
        (data) => expect(data).toEqual(booksPage, 'should return books page'),
        fail
      );

    // should have made one request to GET
    const req = httpTestingController.expectOne(
      bookUrl + 'current?page=1&pageSize=10&firstRequest=true'
    );
    expect(req.request.method).toEqual('GET');
  });

  // Test case 4
  it('should send BookQueryParams and get Page<IBook>, GET method', () => {
    const queryParams = new BookQueryParams();
    const booksPage: IPage<IBook> = null;

    bookService
      .getReadBooks(queryParams)
      .subscribe(
        (data) => expect(data).toEqual(booksPage, 'should return books page'),
        fail
      );

    // should have made one request to GET
    const req = httpTestingController.expectOne(
      bookUrl + 'read?page=1&pageSize=10&firstRequest=true'
    );
    expect(req.request.method).toEqual('GET');
  });
  // Test case 5
  it('should send Book id and get IBook, GET method', () => {
    const id = 1;
    const book: IBook = {
      id: 1,
      name: 'Book',
      userId: 1,
      state: bookState.requested,
      authors: null,
      genres: null,
      rating: 5,
      location: null,
      language: null,
      wishCount: 0
    };

    bookService
      .getBookById(id)
      .subscribe(
        (data) => expect(data).toEqual(book, 'should return book'),
        fail
      );

    // should have made one request to GET
    const req = httpTestingController.expectOne(bookUrl + id);
    expect(req.request.method).toEqual('GET');
  });

  // Test case 6
  it('should deactivate Book by id, PUT method', () => {
    const id = 1;

    bookService.deactivateBook(id).subscribe();

    // should have made one request to POST
    const req = httpTestingController.expectOne(bookUrl + id + '/deactivate');
    expect(req.request.method).toEqual('PUT');
  });

  // Test case 7
  it('should activate Book by id, PUT method', () => {
    const id = 1;

    bookService.activateBook(id).subscribe();

    // should have made one request to POST
    const req = httpTestingController.expectOne(bookUrl + id + '/activate');
    expect(req.request.method).toEqual('PUT');
  });
});
