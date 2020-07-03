import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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

  locationForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<LocationPopupComponent>,
    private locationService: LocationService,
    private formBuilder: FormBuilder) {
      this.locationForm = this.formBuilder.group({
        location: ['', Validators.required],
        roomNumber: ['', [Validators.required, Validators.maxLength(7)]]
      })
     }

  get location() { return this.locationForm.get('location'); }
  get roomNumber() { return this.locationForm.get('roomNumber'); }

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

  onSubmit(): void{
    console.log(this.location.invalid)
    console.log(this.locationForm.value);
  }
}
