import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { ILocation } from '../../models/location';

@Injectable({
  providedIn: 'root',
})
export class MapboxService {
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  geocoderApiUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
  ACCESS_TOKEN: string = environment.mapbox.accessToken;
  lat = 49.83305;
  lng = 23.997775;
  zoom = 15;

  private currentAddressSource = new Subject<ILocation>();
  currentAddressChanged$ = this.currentAddressSource.asObservable();

  geocoder: MapboxGeocoder = new MapboxGeocoder({
    accessToken: this.ACCESS_TOKEN,
    placeholder: 'Search',
    mapboxgl,
    marker: false,
    language: 'en-GB'
  });

  geolocator = new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    trackUserLocation: true,
  });

  marker: mapboxgl.Marker = new mapboxgl.Marker({
    draggable: true,
  }).setLngLat([this.lng, this.lat]);

  constructor(private http: HttpClient) {
    mapboxgl.accessToken = this.ACCESS_TOKEN;
  }

  buildMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: this.zoom,
      center: [this.lng, this.lat],
      language: 'en-GB'
    });

    this.map.addControl(this.geocoder);
    this.map.addControl(this.geolocator);

    // this.marker.addTo(this.map);

    this.geocoder.on('result', (result) => {
      this.setMarkerLngLat(result.result.center[0], result.result.center[1]);
      const address = {
        city: result?.result?.context[0]?.text,
        street: result?.result?.properties?.address,
        officeName: result?.result?.text,
      };
      this.currentAddressSource.next(address);
    });

    this.setEvents();
  }

  setEvents() {
    this.onClick();
    this.onDragEnd();
  }

  setMarkerLngLat(lng: number, lat: number) {
    this.lng = lng;
    this.lat = lat;
    this.marker.setLngLat([this.lng, this.lat]);
  }

  onClick() {
    this.map.on('click', (e) => {
      this.setMarkerLngLat(e.lngLat.lng, e.lngLat.lat);
      this.getFromCoordinates();
    });
  }

  onDragEnd() {
    this.marker.on('dragend', (e) => {
      const lngLat = this.marker.getLngLat();
      this.setMarkerLngLat(lngLat.lng, lngLat.lat);
      this.getFromCoordinates();
    });
  }

  getFromCoordinates() {
    const apiUrl =
      this.geocoderApiUrl +
      this.lng +
      ',' +
      this.lat +
      '.json?access_token=' +
      this.ACCESS_TOKEN;
    this.http.get(apiUrl).subscribe(
      (result: any) => {
        const address = {
          city: result?.features[0]?.context[0]?.text,
          street: result?.features[0]?.properties?.address,
          officeName: result?.features[0]?.text,
        };
        this.currentAddressSource.next(address);
      },
      (error) => {
        alert(error.message);
      }
    );
  }

  public getCoordinatesByAddress(query: string) {
    const apiUrl = this.geocoderApiUrl + `${query}.json?access_token=${this.ACCESS_TOKEN}`;
    console.log(apiUrl);
    this.http.get(apiUrl).subscribe(
      (result) => {
        console.log(result);
      },
      (error) => {
        alert(error.message);
      }
    );
  }
}
