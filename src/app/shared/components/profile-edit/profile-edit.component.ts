import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IUserInfo } from '../../../core/models/userInfo';
import { ILocationHome } from '../../../core/models/locationHome';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LocationService } from '../../../core/services/location/location.service';
import { ILocation } from '../../../core/models/location';
import { DialogService } from '../../../core/services/dialog/dialog.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../../core/services/user/user.service';
import { LocationHomeService } from '../../../core/services/locationHome/locationHome.service';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { IUserPut } from '../../../core/models/userPut';
import { ILocationHomePost } from 'src/app/core/models/locationHomePost';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss'],
})
export class ProfileEditComponent implements OnInit {
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();
  @Input() user: IUserInfo;

  public canPostLocation: boolean;
  public password: string;
  public editUserForm: FormGroup;
  public firstName: string;
  public lastName: string;
  public room: number;
  public location: ILocation;
  public locationHome: ILocationHome;
  public locationHomePost: ILocationHomePost;
  public changingLocation = false;
  public locations: ILocation[] = [];
  public isEmail: boolean;
  public submitted = false;
  public fieldMasks = [
    'FirstName',
    'LastName',
    'BirthDate',
    'UserRoomId',
    'IsEmailAllowed',
  ];

  constructor(
    private userService: UserService,
    private locationHomeService: LocationHomeService,
    private translate: TranslateService,
    private dialogService: DialogService,
    private locationService: LocationService,
    private notificationService: NotificationService,
    private adapter: DateAdapter<any>
  ) { }

  public ngOnInit(): void {
    this.locationHomeService.locationHomePost$.subscribe(location => {
      this.canPostLocation = true;
      this.locationHomePost = location;
      this.locationHomePost.id = this.locationHome?.id;
      this.locationHome = this.locationHomePost;
    });

    this.isEn() ? this.setEngDate() : this.setUkDate();
    this.translate.onLangChange.subscribe(
      () => this.isEn() ? this.setEngDate() : this.setUkDate()
    );
    this.buildForm();
    this.getAllLocations();
    this.getLocationHome();
    this.password = localStorage.getItem('password');
  }

  public openLocationPickerDialog(): void {
    this.dialogService.openHomeLocationDialog(this.user.id);
  }

  public getLocationHome(): void {
    if (this.user.role.user[0]?.locationHomeId != null) {
      this.locationHomeService.getLocationHomeById(this.user.role.user[0]?.locationHomeId).subscribe((location: ILocationHome) => {
        this.locationHome = location;
      },
      (error) => {
        console.log(error);
      }
      );
    }
  }

  public getAllLocations(): void {
    this.locationService.getLocation().subscribe(
      (data) => {
        this.locations = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  public buildForm(): void {
    this.editUserForm = new FormGroup({
      firstName: new FormControl(
        { value: this.user.firstName, disabled: false },
        Validators.required
      ),
      lastName: new FormControl(
        { value: this.user.lastName, disabled: false },
        Validators.required
      ),
      birthDate: new FormControl({
        value: this.user.birthDate,
        disabled: false,
      }),
      isEmail: new FormControl({
        value: this.user.isEmailAllowed,
        disabled: false,
      }),
      room: new FormControl(
        this.user?.userLocation?.roomNumber
          ? this.user.userLocation.roomNumber
          : 0,
        [Validators.required, Validators.maxLength(7)]
      ),
    });
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

  public useHomeLocationEdit(): void {
    if (this.locationHome != null) {
      this.locationHomeService.editLocationHome(this.locationHome).subscribe(
        (data) => {
          this.locationHomeService.submitLocationHome(this.locationHome);
          if (this.locationHome?.isActive) {
            this.notificationService.success(
              this.translate.instant('components.profile.edit.homeLocationUpdate'),
              'X'
            );
          } else if (this.locationHome?.isActive === false) {
            this.notificationService.success(
              this.translate.instant('components.profile.edit.officeLocationUpdate'),
              'X'
            );
          }
        },
        () => {
          this.notificationService.error(
            this.translate.instant('common-errors.error-message'),
            'X'
          );
        }
      );
    }
  }

  public onSubmit(): void {
    if (this.canPostLocation) {
      this.saveLocationHome();
    }
    this.useHomeLocationEdit();
    this.editUserForm.markAllAsTouched();
    if (this.editUserForm.invalid) {
      return;
    }
    this.submitted = true;

    const user: IUserPut = {
      id: this.user.id,
      middleName: this.user.middleName,
      firstName: this.editUserForm.get('firstName').value,
      lastName: this.editUserForm.get('lastName').value,
      birthDate: new Date(this.editUserForm.get('birthDate').value),
      userLocation: this.user.userLocation,
      email: this.user.email,
      isEmailAllowed: this.isEmail,
      password: this.password,
      registeredDate: this.user.registeredDate,
      roleId: this.user.role.id,
      fieldMasks: this.fieldMasks,
    };
    user.birthDate.setHours(12);

    if (this.changingLocation) {
      user.userLocation = {
        location: this.location,
        roomNumber: this.editUserForm.get('room').value,
      };
    } else if (user?.userLocation?.location) {
      user.userLocation.roomNumber = this.editUserForm.get('room').value;
    }

    this.userService.editUser(user.id, user).subscribe(
      () => {
        this.cancel.emit();
      },
      (error) => {
        this.notificationService.error(
          this.translate.instant('Something went wrong'),
          'X'
        );
      }
    );
    this.ngOnInit();
    this.editUserForm.reset();
  }

  public newLocation(location: ILocation): void {
    this.location = location;
    this.changingLocation = true;
  }

  public async Cancel(): Promise<void> {
    this.changingLocation = false;
    this.dialogService
      .openConfirmDialog(
        await this.translate.get(this.translate.instant('components.profile.edit.cancelDialog')).toPromise()
      )
      .afterClosed()
      .subscribe(async (res) => {
        if (res) {
          this.cancel.emit();
          this.editUserForm.reset();
        }
      });
  }

  public onIsEmailChange(isChecked: boolean): void {
    this.isEmail = isChecked;
  }

  public isEn(): boolean {
    return this.translate.currentLang === 'en';
  }

  public setEngDate() {
    this.adapter.setLocale('en');
  }

  public setUkDate() {
    this.adapter.setLocale('ua');
  }
}
