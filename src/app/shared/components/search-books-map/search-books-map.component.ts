import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import {AuthenticationService} from '../../../core/services/authentication/authentication.service';
import {UserService} from '../../../core/services/user/user.service';
import {IUserInfo} from '../../../core/models/userInfo';
import {MapboxBooksService} from '../../../core/services/mapbox/mapbox.books.service';
import {BookService} from '../../../core/services/book/book.service';
import {LocationHomeService} from '../../../core/services/locationHome/locationHome.service';
import {ILocationFilter} from '../../../core/models/books-map/location-filter';
import {ILocationType} from '../../../core/models/books-map/location-type';
import {ILngLat} from '../../../core/models/books-map/lngLat';
import {IMapLocation} from '../../../core/models/books-map/map-location';
import {IMapHomeLocation} from '../../../core/models/books-map/map-homeLocation';

@Component({
  selector: 'app-search-books-map',
  templateUrl: './search-books-map.component.html',
  styleUrls: ['./search-books-map.component.scss']
})
export class SearchBooksMapComponent implements OnInit {
  @Output() locationsChange: EventEmitter<ILocationFilter> = new EventEmitter<ILocationFilter>();

  // user changes this parameter
  public radiusInKm = 0.5;
  userHomeLocation: ILngLat;
  locations: IMapLocation[];
  homeLocations: IMapHomeLocation[];
  currentLocation: ILngLat;
  userHasDefinedLocation: boolean;
  locationType: ILocationType;


  // MARKER
  lng = 23.997775;
  lat = 49.83305;
  marker: mapboxgl.Marker = new mapboxgl.Marker({
    draggable: true,
    color: '#b80d42'
  }).setLngLat([this.lng, this.lat]);

  constructor(
    private mapboxBookService: MapboxBooksService,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private bookService: BookService,
    private homeLocationService: LocationHomeService
  ) {}

  ngOnInit(): void {
    this.mapboxBookService.buildMap().then(() => {
      this.setLocationsOnMap();
      this.setEventForMarker();
      if (this.authenticationService.isAuthenticated()) {
        this.getCurrentUser();
      }
    });
  }

  public changeToCustomMarker(): void {
    if (this.locationType === ILocationType.MARKER) {
      return;
    }
    this.locationType = ILocationType.MARKER;
    this.mapboxBookService.stopTrackingUserLocation();
    this.marker.addTo(this.mapboxBookService.map);
    const markerLocation: ILngLat = {
      lng: this.marker._lngLat.lng,
      lat: this.marker._lngLat.lat
    };
    this.changeLocation(markerLocation);
  }

  public async changeToCurrentLocation(): Promise<void> {
    if (this.locationType === ILocationType.CURRENT) {
      return;
    }
    this.locationType = ILocationType.CURRENT;
    this.marker.remove();
    this.mapboxBookService.trackUserLocation()
      .then((data) => {
        this.changeLocation(data);
    });
  }

  public async changeToHomeLocation(): Promise<void> {
    if (this.locationType === ILocationType.HOME) {
      return;
    }
    this.locationType = ILocationType.HOME;
    this.marker.remove();
    this.mapboxBookService.stopTrackingUserLocation();

    if (!this.authenticationService.isAuthenticated()) {
      this.mapboxBookService.changeBoundaryRadius({lng: 0, lat: 0}, 0);
      return;
    }

    if (!this.userHomeLocation) {
      await this.getCurrentUser();
    }

    if (!this.userHomeLocation.lng || !this.userHomeLocation.lat) {
      return;
    }

    this.changeLocation(this.userHomeLocation);
  }

  public onRadiusChange(): void {
    if (this.radiusInKm > 100) {
      this.radiusInKm = 100;
    }
    if (this.radiusInKm < 0) {
      this.radiusInKm = 0;
    }
    this.mapboxBookService.changeBoundaryRadius(this.currentLocation, this.radiusInKm);
  }

  public filterLocations(): void {
    let locations = this.locations;
    if (this.locations) {
      locations = locations.filter(l => {
        const location: ILngLat = {lng: l.location.longitude, lat: l.location.latitude};
        return (this.mapboxBookService.getDistanceInKm(this.currentLocation, location) <= this.radiusInKm);
      });
    }

    let homeLocations = this.homeLocations;
    if (this.homeLocations) {
      homeLocations = homeLocations.filter(l => {
        const location: ILngLat = {lng: l.location.longitude, lat: l.location.latitude};
        return (this.mapboxBookService.getDistanceInKm(this.currentLocation, location) <= this.radiusInKm);
      });
    }
    const filter: ILocationFilter = {
      locationIds: locations.map(data => data.location.id),
      homeLocationIds: homeLocations.map(data => data.location.id)
    };

    this.locationsChange.emit(filter);
  }




  /* PRIVATE METHODS */
  private async setLocationsOnMap(): Promise<void> {
    await this.setBooksLocationsOnMap();
    await this.changeToCustomMarker();
  }

  private changeLocation(location: ILngLat): void {
    this.currentLocation = location;
    this.mapboxBookService.jumpTo(location.lng, location.lat);
    this.mapboxBookService.changeBoundaryRadius(location, this.radiusInKm);
    this.filterLocations();
  }

  private async setBooksLocationsOnMap(): Promise<void> {
    await this.getMapLocations();
    for (const point of this.locations) {
      const address = `${point.location.city} ${point.location.officeName}, ${point.location.street}`;
      const position: ILngLat = {
        lng: point.location.longitude,
        lat: point.location.latitude
      };
      this.mapboxBookService.addLocationMarker(address, position, point.booksQuantity);
    }

    await this.getHomeLocations();
    for (const homeLocation of this.homeLocations) {
      const address = `${homeLocation.location.city}, ${homeLocation.location.street}`;
      const position: ILngLat = {
        lng: homeLocation.location.longitude,
        lat: homeLocation.location.latitude
      };
      this.mapboxBookService.addLocationMarker(address, position, homeLocation.booksQuantity);
    }
  }

  private async getCurrentUser(): Promise<void> {
    const userId = this.authenticationService.currentUserValue.id;
    await this.userService.getUserById(userId)
      .toPromise()
      .then((data: IUserInfo) => {
          if (data.locationHome.id !== 0 && data.locationHome.isActive) {
            this.userHomeLocation = {
              lng: data.locationHome.longitude,
              lat: data.locationHome.latitude
            };
            this.userHasDefinedLocation = true;
            return;
          }

          if (data.userLocation?.location?.id !== 0 && data.userLocation.location.isActive) {
            this.userHomeLocation = {
              lng: data.userLocation.location.longitude,
              lat: data.userLocation.location.latitude
            };
            this.userHasDefinedLocation = true;
          }
        }
      );
  }

  private async getMapLocations(): Promise<void> {
    await this.bookService.getBooksQuantityOnLocations().toPromise().then(
      (data) => {
        this.locations = data;
      }
    );
  }

  private async getHomeLocations(): Promise<void> {
    await this.homeLocationService.getBooksQuantityOnLocations().toPromise().then(
      (data) => {
        this.homeLocations = data;
      }
    );
  }

  private setEventForMarker(): void {
    this.marker.on('dragend', () => {
      const markerLocation: ILngLat = {
        lng: this.marker._lngLat.lng,
        lat: this.marker._lngLat.lat
      };
      this.changeLocation(markerLocation);
    });
  }
}
