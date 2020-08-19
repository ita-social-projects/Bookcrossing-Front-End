import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { locationUrl } from '../../../configs/api-endpoint.constants';
import { ILocation } from '../../models/location';
import { LocationService } from './location.service';

// Testing of LocationService
describe('#LocationService.getLocation(), .getLocationById(id), .postLocation(location), .deleteLocation(id), .editLocation',
    () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let locationService: LocationService;

  beforeEach(() => {
    // Configures testing app module
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        LocationService
      ]
    });

    // Instantaites HttpClient, HttpTestingController and LocationService
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    locationService = TestBed.inject(LocationService);
  });

  afterEach(() => {
    httpTestingController.verify(); // Verifies that no requests are outstanding.
  });

  // Test case 1
  it('should be GET method and get List of ILocation objects', () => {
    /* tslint:disable */
    let locations: ILocation[];
    /* tslint:enable */


    locationService.getLocation().subscribe(
      data => expect(data).toEqual(locations, 'should return ILocation[]'),
      fail
    );

    // getLocation should have made one request to GET locations
    const req = httpTestingController.expectOne(locationUrl);
    expect(req.request.method).toEqual('GET');
  });


  // Test case 2
  it('should send id and get location GET method', () => {
    const location: ILocation = {
         id: 1,
         city: 'Lviv',
         isActive: true,
         officeName: 'HQ'
    };
    const id = 1;

    locationService.getLocationById(id).subscribe(
      data => expect(data).toEqual(location, 'should send id and get location'),
      fail
    );

    // getLocationById should have made one request to GET location
    const req = httpTestingController.expectOne(locationUrl + id);
    expect(req.request.method).toEqual('GET');
  });


  // Test case 3
  it('should send location and get it back POST method', () => {
    const newLocation: ILocation = {
         id: 1,
         city: 'Lviv',
         isActive: true,
         officeName: 'HQ'
    };

    locationService.postLocation(newLocation).subscribe(
      data => expect(data).toEqual(newLocation, 'should send location and get it'),
      fail
    );

    // postLocation should have made one request to POST location
    const req = httpTestingController.expectOne(locationUrl);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(newLocation);
  });


   // Test case 4
  it('should send id DELETE method', () => {
    const id = 1;

    locationService.deleteLocation(id).subscribe(
      data => expect(data).toEqual(Object, 'should send id and return'),
      fail
    );

    // deleteLocation should have made one request to DELETE location
    const req = httpTestingController.expectOne(locationUrl + id);
    expect(req.request.method).toEqual('DELETE');
  });


  // Test case 5
  it('should send location PUT method', () => {
    const newLocation: ILocation = {
         id: 1,
         city: 'Lviv',
         isActive: true,
         officeName: 'HQ'
    };

    locationService.editLocation(newLocation).subscribe(
      data => expect(data).toEqual(Object, 'should send location and return'),
      fail
    );

    // editLocation should have made one request to PUT location
    const req = httpTestingController.expectOne(locationUrl);
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(newLocation);
  });
});

