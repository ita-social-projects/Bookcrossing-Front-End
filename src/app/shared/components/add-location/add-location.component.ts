import { Component, OnInit } from '@angular/core';
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
  public isEdited: boolean = false;

  constructor(
    private locationService: LocationService,
    private mapboxService: MapboxService
  ) {
    mapboxService.currentAddressChanged$.subscribe((address) => {
      this.address = address;
      this.setLocationFormValues(address);
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
    let location: ILocation = {
      city: this.addLocationForm.get('city').value,
      street: this.addLocationForm.get('street').value,
      officeName: this.addLocationForm.get('officeName').value,
    };
    console.log(location);
    if (!this.isEdited) {
      this.postLocation(location);
    } else {
      location.id = this.address.id;
      this.editLocation(location);
    }

    this.isEdited = false;
    this.addLocationForm.reset();
  }

  postLocation(location: ILocation) {
    this.locationService.postLocation(location).subscribe(
      (data: ILocation) => {
        alert('Successfully added');
        // to emit event end send new location to <app-view-location>
        this.locationService.submitLocation(location);
      },
      (error) => {
        alert(error.message);
        console.log(error);
      }
    );
  }

  editLocation(location: ILocation) {
    this.locationService.editLocation(location).subscribe(
      (result) => {
        alert('Successfully changed');
        // to emit event end send new location to <app-view-location>
        this.locationService.submitLocation(location);
        console.log(result);
      },
      (error) => {
        alert(error.message);
        console.log(error);
      }
    );
  }

  setLocationFormValues(location: ILocation) {
    this.addLocationForm.patchValue({ ['city']: location.city });
    this.addLocationForm.patchValue({ ['street']: location.street });
    this.addLocationForm.patchValue({
      ['officeName']: location.officeName,
    });
  }

  onEditCancel() {
    this.isEdited = false;
    this.addLocationForm.reset();
  }

  onEditClick(event) {
    this.isEdited = true;
    this.setLocationFormValues(event);
    this.address = event;
  }
}
