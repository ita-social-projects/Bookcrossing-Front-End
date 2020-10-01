import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as mapboxgl from 'mapbox-gl';
import { HttpClient } from '@angular/common/http';
import {ILngLat} from '../../models/books-map/lngLat';

@Injectable({
  providedIn: 'root',
})
export class MapboxBooksService {
  map: mapboxgl.Map;
  geolocator = new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    trackUserLocation: true,
  });
  style = 'mapbox://styles/mapbox/streets-v11';
  geocoderApiUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
  ACCESS_TOKEN: string = environment.mapbox.accessToken;
  zoom = 14;

  // current radius
  radiusInKm: number;

  constructor(private http: HttpClient) {
    mapboxgl.accessToken = this.ACCESS_TOKEN;
  }

  public buildMap(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.map = new mapboxgl.Map({
        container: 'map',
        style: this.style,
        zoom: this.zoom,
        attributionControl: false
      });
      this.map.on('load', () => {
        this.setBoundaryRadius({lng: 0, lat: 0}, 0);
        resolve();
      });
      this.map.addControl(this.geolocator);
      // hide control on map
      this.geolocator._container.attributes.class.ownerElement.style.display = 'none';
    });
  }

  public jumpTo(lng: number, lat: number): void {
    this.map.jumpTo({
      center: [lng, lat]
    });
  }

  public addLocationMarker(address: string, location: ILngLat, booksQuantity: number) {
    const popup = new mapboxgl.Popup().setHTML(
      `<strong>${address}</strong>
       <p>Books quantity: ${booksQuantity}</p>`
    );

    const marker: mapboxgl.Marker = new mapboxgl
      .Marker({color: '#ed7f3b'})
      .setPopup(popup)
      .setLngLat([location.lng, location.lat]);
    marker.addTo(this.map);
  }

  public setBoundaryRadius(location: ILngLat, radius: number): void {
    this.map.addSource('polygon', this.createGeoJSONCircle([location.lng, location.lat], radius));
    this.map.addLayer({
      id: 'polygon',
      type: 'fill',
      source: 'polygon',
      layout: {},
      paint: {
        'fill-color': '#9c9595',
        'fill-opacity': 0.3
      }
    });
  }

  public changeBoundaryRadius(location: ILngLat, radius: number) {
    this.radiusInKm = radius;
    if (location) {
      this.map.getSource('polygon')
        .setData(this.createGeoJSONCircle([location.lng, location.lat], this.radiusInKm).data);
    }
  }

  public async trackUserLocation(): Promise<ILngLat> {
    if (this.isGeolocatorEnabled()) {
      return;
    }

    return new Promise<ILngLat>((resolve) => {
      this.geolocator.on('geolocate', () => {
        const trackedLocation: ILngLat = {
          lng: this.geolocator._userLocationDotMarker._lngLat.lng,
          lat: this.geolocator._userLocationDotMarker._lngLat.lat,
        };
        resolve(trackedLocation);
      });
      this.geolocator.trigger();
    });
  }

  public stopTrackingUserLocation(): void {
    if (this.isGeolocatorEnabled()) {
      this.geolocator.trigger();
      if (this.geolocator._watchState === 'ACTIVE_LOCK') {
        this.geolocator.trigger();
      }
    }
  }

  public isGeolocatorEnabled(): boolean {
    return this.geolocator._watchState !== 'OFF';
  }

  public getDistanceInKm(point1: ILngLat, point2: ILngLat): number {
    return (new mapboxgl.LngLat(point1.lng, point1.lat)
      .distanceTo(new mapboxgl.LngLat(point2.lng, point2.lat)) / 1000);
  }

  private createGeoJSONCircle(center, radiusInKm: number, points?: number) {
    if (!points) {
      points = 64;
    }

    const coords = {
      latitude: center[1],
      longitude: center[0]
    };

    const km = radiusInKm;

    const ret = [];
    const distanceX = km / (111.320 * Math.cos(coords.latitude * Math.PI / 180));
    const distanceY = km / 110.574;

    let theta;
    let x;
    let y;

    for (let i = 0; i < points; i++) {
      theta = (i / points) * (2 * Math.PI);
      x = distanceX * Math.cos(theta);
      y = distanceY * Math.sin(theta);

      ret.push([coords.longitude + x, coords.latitude + y]);
    }
    ret.push(ret[0]);

    return {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [ret]
          }
        }]
      }
    };
  }
}
