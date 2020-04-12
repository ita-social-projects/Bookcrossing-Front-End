import { Component, OnInit } from '@angular/core';
import { MapboxService } from 'src/app/core/services/mapbox/mapbox.service';
import { ILocation } from 'src/app/core/models/location';

@Component({
  selector: 'app-mapbox',
  templateUrl: './mapbox.component.html',
  styleUrls: ['./mapbox.component.scss'],
})
export class MapboxComponent implements OnInit {
  constructor(private mapboxService: MapboxService) {}

  ngOnInit(): void {
    this.mapboxService.buildMap();
  }
}
