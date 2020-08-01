import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { languageUrl } from '../../../configs/api-endpoint.constants';
import { ILanguage } from '../../models/language'
import { BookLanguageService } from './bookLanguage';

//Testing of BookLanguageService
describe('#BookLanguageService.getLanguage(), .getLanguageById(id), .postLanguage(location), .deleteLanguage(id), .editLanguage(language)', 
    () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let languageService: BookLanguageService;

  beforeEach(() => {
    //Configures testing app module
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        BookLanguageService
      ]
    });

    //Instantaites HttpClient, HttpTestingController and BookLanguageService
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    languageService = TestBed.inject(BookLanguageService);
  });

  afterEach(() => {
    httpTestingController.verify(); //Verifies that no requests are outstanding.
  });
  
  //Test case 1
  it('should be GET method and get List of ILanguage objects', () => {
    let languages: ILanguage[];


    languageService.getLanguage().subscribe(
      data => expect(data).toEqual(languages, 'should return ILanguage[]'),
      fail
    );

    // getLanguage should have made one request to GET languages
    const req = httpTestingController.expectOne(languageUrl);
    expect(req.request.method).toEqual('GET');
  });
  

  //Test case 2
  it('should send id and get language GET method', () => {
    const language: ILanguage = 
    {
         id: 1,
         name: 'English' 
    };
    let id: 1;

    languageService.getLanguageById(id).subscribe(
      data => expect(data).toEqual(language, 'should send id and get language'),
      fail
    );

    // getLanguageById should have made one request to GET language
    const req = httpTestingController.expectOne(languageUrl + id);
    expect(req.request.method).toEqual('GET');
  });

  
  //Test case 3
  it('should send language and get it back POST method', () => {
    const newLanguage: ILanguage = 
    {
         id: 1,
         name: 'English' 
    };

    languageService.postLanguage(newLanguage).subscribe(
      data => expect(data).toEqual(newLanguage, 'should send language and get it'),
      fail
    );

    // postLanguage should have made one request to POST language
    const req = httpTestingController.expectOne(languageUrl);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(newLanguage);
  });


   //Test case 4
   it('should send id DELETE method', () => {
    let id: 1;

    languageService.deleteLanguage(id).subscribe(
      data => expect(data).toEqual(Object, 'should send id and return'),
      fail
    );

    // deleteLanguage should have made one request to DELETE language
    const req = httpTestingController.expectOne(languageUrl + id);
    expect(req.request.method).toEqual('DELETE');
  });


  //Test case 5
  it('should send location PUT method', () => {
    const newLanguage: ILanguage = 
    {
         id: 1,
         name: 'English' 
    };


    languageService.editLanguage(newLanguage).subscribe(
      data => expect(data).toEqual(Object, 'should send language and return'),
      fail
    );

    // editLanguage should have made one request to PUT location
    const req = httpTestingController.expectOne(languageUrl);
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(newLanguage);
  });
}); 

