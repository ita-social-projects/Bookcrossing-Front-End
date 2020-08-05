import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { LocationService } from 'src/app/core/services/location/location.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { ILocation } from 'src/app/core/models/location';
import { IUserInfo } from 'src/app/core/models/userInfo';
import { IUserPut } from 'src/app/core/models/userPut';
import { IRoomLocation } from 'src/app/core/models/roomLocation';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/core/services/notification/notification.service';

@Component({
  selector: 'app-location-popup',
  templateUrl: './location-popup.component.html',
  styleUrls: ['./location-popup.component.scss']
})
export class LocationPopupComponent implements OnInit {
  locations: ILocation[] = [];

  locationForm: FormGroup;
  private locationFormMasks: string[] = ['UserRoomId'];

  constructor(public dialogRef: MatDialogRef<LocationPopupComponent>,
    private locationService: LocationService,
    private userService: UserService,
    private translateService: TranslateService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private user: IUserInfo) {
      this.locationForm = this.formBuilder.group({
        location: ['', Validators.required],
        roomNumber: ['', [Validators.required, Validators.maxLength(7), Validators.pattern(/^[^\s]{1,7}$/)]]
      });
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

    if(!this.user) this.notificationService.info("This is test version of dialog for design testing. You can't modify your location there.", "X");
  }

  onSubmit(): void {
    if(this.locationForm.invalid) return;
    if(!this.user) return;

    const newLocation: IRoomLocation = {
      roomNumber: this.roomNumber.value,
      location: this.location.value
    }

    const userPut: IUserPut = {
      id: this.user.id,
      middleName: this.user.middleName,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      birthDate: this.user.birthDate,
      userLocation: newLocation,
      email: this.user.email,
      isEmailAllowed: this.user.isEmailAllowed,
      password: localStorage.getItem('password'),
      registeredDate: this.user.registeredDate,
      roleId: this.user.role.id,
      fieldMasks: this.locationFormMasks
    }

    this.userService.editUser(this.user.id, userPut).subscribe(
      () => this.dialogRef.close(true),
      (error) => {
        console.log(error);
        this.notificationService.error(this.translateService.instant('Something went wrong'), 'X');
      });
  }
}
