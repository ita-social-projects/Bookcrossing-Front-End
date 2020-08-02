import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { userUrl } from '../../../configs/api-endpoint.constants';
import { IUserReg } from "../../models/UserReg";
import { RegistrationService } from './registration.service';

//Testing of RegistrationService
describe('#RegistrationService.registrate(IUserReg)', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let registrationService: RegistrationService;

  beforeEach(() => {
    //Configures testing app module
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RegistrationService
      ]
    });

    //Instantaites HttpClient, HttpTestingController and RegistrationService
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    registrationService = TestBed.inject(RegistrationService);
  });

  afterEach(() => {
    httpTestingController.verify(); //Verifies that no requests are outstanding.
  });
  
  //Test case 1
  it('should add user and return it POST method', () => {
    const newUser: IUserReg = 
    {
         id: 34, 
         name: 'Andriy', 
         surname: 'Oleksiuk', 
         email:'qwerty@gmail.com', 
         password: '1234' 
        };

    registrationService.registrate(newUser).subscribe(
      data => expect(data).toEqual(newUser, 'should return the user'),
      fail
    );

    // registrate should have made one request to POST user
    const req = httpTestingController.expectOne(userUrl);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(newUser);
    
  });
}); 