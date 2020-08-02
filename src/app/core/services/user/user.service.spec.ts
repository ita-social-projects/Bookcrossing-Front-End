import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { userUrl } from '../../../configs/api-endpoint.constants';
import { IUser } from "../../models/User";
import { IUserPut } from "../../models/UserPut";
import { ILocation } from '../../models/location'
import { IRoomLocation } from '../../models/roomLocation';
import { UserService } from './user.service';

//Testing of UserService
describe('#UserService.getUserById(id), UserService.editUser(id, IUserPut)', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let userService: UserService;

  beforeEach(() => {
    //Configures testing app module
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserService
      ]
    });

    //Instantaites HttpClient, HttpTestingController and UserService
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    userService = TestBed.inject(UserService);
  });

  afterEach(() => {
    httpTestingController.verify(); //Verifies that no requests are outstanding.
  });
  
  //Test case 1
  it('should send user id and get it GET method', () => {
    const newUser: IUser = 
    {
         id: 1, 
         firstName: 'Andriy', 
         lastName: 'Oleksiuk', 
         email:'qwerty@gmail.com', 
         isEmailAllowed: true,
         userLocation: null,
         role: null,
         birthDate: null,
         registeredDate: null,
         token: null
    };
    let id: 1;

    userService.getUserById(id).subscribe(
      data => expect(data).toEqual(newUser, 'should return the user'),
      fail
    );

    // getUserById should have made one request to GET user
    const req = httpTestingController.expectOne(userUrl + `/${id}`);
    expect(req.request.method).toEqual('GET');
  });

  //Test case 2
  it('should send edited user and their id PUT method', () => {
    const newUser: IUserPut = 
    {
         id: 1, 
         firstName: 'Andriy', 
         lastName: 'Oleksiuk', 
         email:'qwerty@gmail.com', 
         password: '1234',
         isEmailAllowed: true,
         userLocation: null,
         roleId: 1,
         birthDate: null,
         registeredDate: null,
    };
    let id: 1;

    userService.editUser(id, newUser).subscribe(
      data => expect(data).toEqual(Object, 'should send User and return'),
      fail
    );

    // editUser should have made one request to PUT user
    const req = httpTestingController.expectOne(userUrl + '/' + 1);
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(newUser);
  });


}); 

