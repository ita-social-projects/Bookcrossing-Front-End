import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { locationHomeUrl } from '../../../configs/api-endpoint.constants';
import { ILocationHome } from '../../models/locationHome';
import { LocationHomeService } from './locationHome.service';

// Testing of LocationService
describe('#LocationHomeService.getLocationHome(), .getLocationHomeById(id),' +
' .postLocationHome(location), .deleteLocationHome(id), .editLocationHome',
    () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let locationService: LocationHomeService;

  beforeEach(() => {
    // Configures testing app module
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        LocationHomeService
      ]
    });

    // Instantaites HttpClient, HttpTestingController and LocationService
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    locationService = TestBed.inject(LocationHomeService);
  });

  afterEach(() => {
    httpTestingController.verify(); // Verifies that no requests are outstanding.
  });

  // Test case 1
  it('should be GET method and get List of ILocationHome objects', () => {
    /* tslint:disable */
    let locations: ILocationHome[];
    /* tslint:enable */


    locationService.getLocationHome().subscribe(
      data => expect(data).toEqual(locations, 'should return ILocationHome[]'),
      fail
    );

    // getLocation should have made one request to GET locations
    const req = httpTestingController.expectOne(locationHomeUrl);
    expect(req.request.method).toEqual('GET');
  });


  // Test case 2
  it('should send id and get location GET method', () => {
    const locationHome: ILocationHome = {
        id: 1,
        city: 'Lviv',
        isActive: true,
        latitude: 20.121,
        longitude: 48.231,
        UserId: 1
    };
    const id = 1;

    locationService.getLocationHomeById(id).subscribe(
      data => expect(data).toEqual(locationHome, 'should send id and get location'),
      fail
    );

    // getLocationById should have made one request to GET location
    const req = httpTestingController.expectOne(locationHomeUrl + id);
    expect(req.request.method).toEqual('GET');
  });


  // Test case 3
  it('should send location and get it back POST method', () => {
    const newLocationHome: ILocationHome = {
        id: 1,
        city: 'Lviv',
        isActive: true,
        latitude: 20.121,
        longitude: 48.231,
        UserId: 1
    };

    locationService.postLocationHome(newLocationHome).subscribe(
      data => expect(data).toEqual(newLocationHome, 'should send location and get it'),
      fail
    );

    // postLocation should have made one request to POST location
    const req = httpTestingController.expectOne(locationHomeUrl);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(newLocationHome);
  });


   // Test case 4
  it('should send id DELETE method', () => {
    const id = 1;

    locationService.deleteLocationHome(id).subscribe(
      data => expect(data).toEqual(Object, 'should send id and return'),
      fail
    );

    // deleteLocation should have made one request to DELETE location
    const req = httpTestingController.expectOne(locationHomeUrl + id);
    expect(req.request.method).toEqual('DELETE');
  });


  // Test case 5
  it('should send location PUT method', () => {
    const newLocationHome: ILocationHome = {
        id: 1,
        city: 'Lviv',
        isActive: true,
        latitude: 20.121,
        longitude: 48.231,
        UserId: 1
    };

    locationService.editLocationHome(newLocationHome).subscribe(
      data => expect(data).toEqual(Object, 'should send location and return'),
      fail
    );

    // editLocation should have made one request to PUT location
    const req = httpTestingController.expectOne(locationHomeUrl);
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(newLocationHome);
  });
});

