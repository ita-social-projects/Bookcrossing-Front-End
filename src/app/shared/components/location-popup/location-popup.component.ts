import { Component, OnInit } from '@angular/core';

import { LocationService } from 'src/app/core/services/location/location.service';
import { ILocation } from 'src/app/core/models/location';

import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-location-popup',
  templateUrl: './location-popup.component.html',
  styleUrls: ['./location-popup.component.scss']
})
export class LocationPopupComponent implements OnInit {
  locations: ILocation[] = [];

  constructor(public dialogRef: MatDialogRef<LocationPopupComponent>,
    private locationService: LocationService) { }

  ngOnInit(): void {
    this.locationService.getLocation().subscribe(
      (data) => {
        this.locations = data;
      },
      (error) => {
        console.log(error);
      }
    )
  }

}
