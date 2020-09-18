import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IUserInfo } from '../../../core/models/userInfo';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LocationService } from '../../../core/services/location/location.service';
import { ILocation } from '../../../core/models/location';
import { DialogService } from '../../../core/services/dialog/dialog.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../../core/services/user/user.service';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { IUserPut } from '../../../core/models/userPut';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss'],
})
export class ProfileEditComponent implements OnInit {
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();
  @Input() user: IUserInfo;

  public password: string;

  public editUserForm: FormGroup;

  public firstName: string;
  public lastName: string;
  public room: number;
  public location: ILocation;
  public changingLocation = false;
  public locations: ILocation[] = [];
  public isEmail: boolean;
  public changeLocation = false;
  public submitted = false;
  public homeAdress: string;
  public fieldMasks = [
    'FirstName',
    'LastName',
    'BirthDate',
    'UserRoomId',
    'UserHomeAdressId',
    'IsEmailAllowed',
  ];
  private notificationService: NotificationService;

  constructor(
    private userService: UserService,
    private translate: TranslateService,
    private dialogService: DialogService,
    private locationService: LocationService
  ) {}

  public ngOnInit(): void {
    this.buildForm();
    this.getAllLocations();
    this.password = localStorage.getItem('password');
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
      changeLocation: new FormControl({
        value: null
      }),
      room: new FormControl(
        this.user?.userRoomLocation?.roomNumber
          ? this.user.userRoomLocation.roomNumber
          : 0,
        [Validators.maxLength(7)]
      ),
      homeAdress: new FormControl(
        this.user?.userHomeAdress?.homeAdress
          ? this.user.userHomeAdress.homeAdress
          : 0
      )
    });
  }

  public onSubmit(): void {
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
      userRoomLocation: this.user.userRoomLocation,
      userHomeAdress: this.user.userHomeAdress,
      email: this.user.email,
      isEmailAllowed: this.isEmail,
      password: this.password,
      registeredDate: this.user.registeredDate,
      roleId: this.user.role.id,
      fieldMasks: this.fieldMasks,
    };
    user.birthDate.setHours(12);

    if (this.changingLocation) {
      if (this.editUserForm.get('changeLocation').value === true) {
      user.userHomeAdress = {
        location: this.location,
        homeAdress: this.editUserForm.get('homeAdress').value
      };
    } else {
      user.userRoomLocation = {
        location: this.location,
        roomNumber: this.editUserForm.get('room').value,
      };
    }

    } else if (user?.userRoomLocation?.location) {
      user.userRoomLocation.roomNumber = this.editUserForm.get('room').value;
      user.userHomeAdress.homeAdress = this.editUserForm.get('homeAdress').value;
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
        await this.translate.get('Are yo sure want to cancel?').toPromise()
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
}