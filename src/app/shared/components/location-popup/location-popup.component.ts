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
import { LocationHomeService } from 'src/app/core/services/locationHome/locationHome.service';
import { ILocationHomePost } from 'src/app/core/models/locationHomePost';

@Component({
  selector: 'app-location-popup',
  templateUrl: './location-popup.component.html',
  styleUrls: ['./location-popup.component.scss'],
})
export class LocationPopupComponent implements OnInit {
  locations: ILocation[] = [];

  locationForm: FormGroup;
  locationHomeForm: FormGroup;
  public locationDialogIsOpen: boolean;
  public canSubmitLocationHome = false;
  public tooltip = this.translate.instant('components.locationpopup.chooseone');
  public locationHomePost: ILocationHomePost;
  private locationFormMasks: string[] = ['UserRoomId'];

  constructor(
    public dialogRef: MatDialogRef<LocationPopupComponent>,
    private locationService: LocationService,
    private locationHomeService: LocationHomeService,
    private translate: TranslateService,
    private userService: UserService,
    private translateService: TranslateService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private user: IUserInfo
  ) {
    this.locationDialogIsOpen = false;
    this.locationForm = this.formBuilder.group({
      location: ['', Validators.required],
      roomNumber: [
        '',
        [
          Validators.required,
          Validators.maxLength(7),
          Validators.pattern(/^[^\s]{1,7}$/),
        ],
      ],
    });
    this.locationHomeForm = this.formBuilder.group({
      locationHome: ['', Validators.required, Validators.pattern(/^(?!\s*$).+/)]
    });
  }

  get locationHome() {
    return this.locationHomeForm.get('locatinHome');
  }
  get location() {
    return this.locationForm.get('location');
  }
  get roomNumber() {
    return this.locationForm.get('roomNumber');
  }

  ngOnInit(): void {
    this.locationHomeService.locationHomePost$.subscribe(location => {
      this.locationHomePost = location;
      this.locationHomePost.UserId = this.user?.id;
      this.locationDialogIsOpen = false;
      this.tooltip = location?.city + ', ' + location?.street;
      this.canSubmitLocationHome = true;
    },
    (error) => {
      console.log(error);
    });

    this.locationService.getLocation().subscribe(
      (data) => {
        this.locations = data;
      },
      (error) => {
        console.log(error);
      }
    );

    if (!this.user) {
      this.notificationService.info(
        /* tslint:disable */
        "This is test version of dialog for design testing. You can't modify your location there.",
        /* tslint:enable */
        'X'
      );
    }
  }

  public saveLocationHome(): void {
    this.locationHomeService.postLocationHome(this.locationHomePost).subscribe(
      (data) => {
        this.locationHomeService.submitLocationHomePost(this.locationHomePost);
        this.notificationService.success(
          this.translate.instant('components.profile.edit.locationUpdate'),
          'X'
        );
      },
      () => {
        this.notificationService.error(
          this.translate.instant('common-error.error-message'),
          'X'
        );
      }
    );
  }

  public onSubmitLocationHome(): void {
    if (!this.user) {
      return;
    }
    this.saveLocationHome();
    this.dialogRef.close(true);
  }

  onSubmitLocation(): void {
    if (this.locationForm.invalid) {
      return;
    }
    if (!this.user) {
      return;
    }

    const newLocation: IRoomLocation = {
      roomNumber: this.roomNumber.value,
      location: this.location.value,
    };

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
      fieldMasks: this.locationFormMasks,
    };

    this.userService.editUser(this.user.id, userPut).subscribe(
      () => this.dialogRef.close(true),
      (error) => {
        console.log(error);
        this.notificationService.error(
          this.translateService.instant('Something went wrong'),
          'X'
        );
      }
    );
  }
}
