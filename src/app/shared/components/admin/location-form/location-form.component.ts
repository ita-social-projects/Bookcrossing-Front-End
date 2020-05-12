import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LocationService } from 'src/app/core/services/location/location.service';
import { ILocation } from 'src/app/core/models/location';
import { MapboxService } from 'src/app/core/services/mapbox/mapbox.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {NotificationService} from '../../../../core/services/notification/notification.service';

@Component({
  selector: 'app-location-form',
  templateUrl: './location-form.component.html',
  styleUrls: ['./location-form.component.scss'],
})
export class LocationFormComponent implements OnInit {
  public address: ILocation;
  public locationEdit: ILocation = {};
  public isEdited = false;

  constructor(
    private translate: TranslateService,
    private notificationService: NotificationService,
    private router: ActivatedRoute,
    private locationService: LocationService,
    private mapboxService: MapboxService,
    private route: Router
  ) {
    mapboxService.currentAddressChanged$.subscribe((address) => {
      this.address = address;
      this.setLocationFormValues(address);
    });
  }

  addLocationForm: FormGroup;

  ngOnInit(): void {
    this.buildForm();
    if (this.router.snapshot.paramMap.has('id')) {
      this.locationEdit.id = +this.router.snapshot.paramMap.get('id');
      this.locationEdit.city = this.router.snapshot.paramMap.get('city');
      this.locationEdit.officeName = this.router.snapshot.paramMap.get('officeName');
      this.locationEdit.street = this.router.snapshot.paramMap.get('street');
      this.isEdited = true;
      this.setLocationFormValues(this.locationEdit);
    }
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
    console.log(location);
    if (!this.isEdited) {
      this.postLocation(location);
    } else {
      location.id = this.locationEdit.id;
      this.editLocation(location);
    }
    this.onCancel();
  }

  postLocation(location: ILocation) {
    this.locationService.postLocation(location).subscribe(
      (data: ILocation) => {
        this.locationService.submitLocation(data);
      },
      () => {
        this.notificationService.warn(this.translate
          .instant('Something went wrong!'), 'X');
      }
    );
  }

  editLocation(location: ILocation) {
    this.locationService.editLocation(location).subscribe(
      (data) => {
        this.locationService.submitLocation(location);
      },
      () => {
        this.notificationService.warn(this.translate
        .instant('Something went wrong!'), 'X');
      }
    );
  }
//

  setLocationFormValues(location: ILocation) {
    this.addLocationForm.patchValue({ ['city']: location.city });
    this.addLocationForm.patchValue({ ['street']: location.street });
    this.addLocationForm.patchValue({
      ['officeName']: location.officeName,
    });
  }

  onCancel() {
    this.route.navigate(['admin/locations']);
  }
}
