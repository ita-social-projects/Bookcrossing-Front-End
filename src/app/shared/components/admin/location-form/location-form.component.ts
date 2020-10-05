import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LocationService } from 'src/app/core/services/location/location.service';
import { ILocation } from 'src/app/core/models/location';
import { Location } from '@angular/common';
import { MapboxService } from 'src/app/core/services/mapbox/mapbox.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { ILngLat } from 'src/app/core/models/books-map/lngLat';

@Component({
  selector: 'app-location-form',
  templateUrl: './location-form.component.html',
  styleUrls: ['./location-form.component.scss'],
})
export class LocationFormComponent implements OnInit {
  public address: ILocation;
  public locationEdit: ILocation = {};
  public isEdited = false;
  public submitButtonText: string;

  constructor(
    private translate: TranslateService,
    private notificationService: NotificationService,
    private router: ActivatedRoute,
    private locationService: LocationService,
    private mapboxService: MapboxService,
    private ngLocation: Location
  ) {
    mapboxService.currentAddressChanged$.subscribe((address) => {
      this.address = {
        city: address.city,
        street: address.street,
        officeName: address.officeName,
        latitude: this.mapboxService.lat,
        longitude: this.mapboxService.lng,
        isActive: true
      };
      this.locationEdit.latitude = this.address.latitude;
      this.locationEdit.longitude = this.address.longitude;
      this.setLocationFormValues(address);
    });
  }

  addLocationForm: FormGroup;

  public ngOnInit(): void {

    this.buildForm();
    if (this.router.snapshot.paramMap.has('id')) {
      const locationid = +this.router.snapshot.paramMap.get('id');
      this.locationService.getLocationById(locationid).subscribe(
        (location) => {
          this.locationEdit.longitude = location.longitude;
          this.locationEdit.latitude = location.latitude;
        }
      );
      this.locationEdit.id = locationid;
      this.locationEdit.city = this.router.snapshot.paramMap.get('city');
      this.locationEdit.officeName = this.router.snapshot.paramMap.get(
        'officeName'
      );
      this.locationEdit.street = this.router.snapshot.paramMap.get('street');
      this.locationEdit.isActive =
        this.router.snapshot.paramMap.get('isActive') === 'true';

      this.isEdited = true;
      this.setLocationFormValues(this.locationEdit);
    }
    this.submitButtonText = this.isEdited ? 'common.update' : 'common.save';
  }

  public buildForm(): void {
    this.addLocationForm = new FormGroup({
      city: new FormControl(null, [
        Validators.required,
        Validators.maxLength(50),
      ]),
      street: new FormControl(null, [
        Validators.required,
        Validators.maxLength(50),
      ]),
      officeName: new FormControl(null, [
        Validators.required,
        Validators.maxLength(50),
      ]),
      isActive: new FormControl(true, Validators.required)
    });

    if (!this.isEdited) {
      /* tslint:disable */
      this.addLocationForm.controls['isActive'].setValue(true);
      /* tslint:enable */
    }
  }

  public onSubmit(): void {
    this.addLocationForm.markAllAsTouched();
    if (this.addLocationForm.invalid) {
      return;
    }

    const location: ILocation = {
      id: this.locationEdit.id,
      city: this.addLocationForm.get('city').value,
      street: this.addLocationForm.get('street').value,
      officeName: this.addLocationForm.get('officeName').value,
      isActive: this.addLocationForm.get('isActive').value,
      longitude: this.locationEdit.longitude,
      latitude: this.locationEdit.latitude
    };

    if (!this.isEdited) {
      this.postLocation(location);
    } else {
      this.editLocation(location);
    }
  }

  public postLocation(location: ILocation): void {
    this.locationService.postLocation(location).subscribe(
      (data: ILocation) => {
        this.locationService.submitLocation(data);
        this.notificationService.success(
          this.translate.instant(
            'components.admin.location-form.add-success-msg'
          ),
          'X'
        );
        this.onCancel();
      },
      () => {
        this.notificationService.error(
          this.translate.instant('common-error.error-message'),
          'X'
        );
      }
    );
  }

  public editLocation(location: ILocation): void {
    this.locationService.editLocation(location).subscribe(
      (data) => {
        this.locationService.submitLocation(location);
        this.notificationService.success(
          this.translate.instant(
            'components.admin.location-form.update-success-msg'
          ),
          'X'
        );
        this.onCancel();
      },
      () => {
        this.notificationService.error(
          this.translate.instant('common-error.error-message'),
          'X'
        );
      }
    );
  }

  public setLocationFormValues(location: ILocation): void {
    this.addLocationForm.patchValue({ ['city']: location.city });
    this.addLocationForm.patchValue({ ['street']: location.street });
    this.addLocationForm.patchValue({
      ['officeName']: location.officeName,
    });
    this.addLocationForm.patchValue({
      ['isActive']: location.isActive,
    });
    if (!this.isEdited) {
      this.addLocationForm.patchValue({
        ['isActive']: true,
      });
    }
  }
  public onCancel(): void {
    this.ngLocation.back();
  }
}
