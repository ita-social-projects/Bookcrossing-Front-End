import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LocationService } from 'src/app/core/services/location/location.service';
import { ILocation } from 'src/app/core/models/location';
import { MapboxService } from 'src/app/core/services/mapbox/mapbox.service';
import { MapboxComponent } from '../mapbox/mapbox.component';

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.scss'],
})
export class AddLocationComponent implements OnInit {
  public address: ILocation;

  constructor(
    private locationService: LocationService,
    private mapboxService: MapboxService
  ) {
    mapboxService.currentAddressChanged$.subscribe((address) => {
      this.address = address;
      this.setLocationFormValues();
    });
  }

  addLocationForm: FormGroup;

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.addLocationForm = new FormGroup({
      city: new FormControl(null, Validators.required),
      street: new FormControl(null, Validators.required),
      officeName: new FormControl(null, Validators.required),
    });
  }

  onSubmit() {
    const location: ILocation = {
      city: this.addLocationForm.get('city').value,
      street: this.addLocationForm.get('street').value,
      officeName: this.addLocationForm.get('officeName').value,
    };
    this.locationService.postLocation(location).subscribe(
      (data: ILocation) => {
        alert('Successfully added');
      },
      (error) => {
        alert(error.message);
      }
    );

    this.addLocationForm.reset();
  }

  setLocationFormValues() {
    this.addLocationForm.patchValue({ ['city']: this.address.city });
    this.addLocationForm.patchValue({ ['street']: this.address.street });
    this.addLocationForm.patchValue({
      ['officeName']: this.address.officeName,
    });
  }
}
