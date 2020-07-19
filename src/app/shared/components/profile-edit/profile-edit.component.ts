import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IUser} from '../../../core/models/user';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LocationService} from '../../../core/services/location/location.service';
import {ILocation} from '../../../core/models/location';
import {DialogService} from '../../../core/services/dialog/dialog.service';
import {TranslateService} from '@ngx-translate/core';
import {UserService} from '../../../core/services/user/user.service';
import {NotificationService} from '../../../core/services/notification/notification.service';
import {IUserPut} from '../../../core/models/userPut';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {

  @Output() onCancel: EventEmitter<void> = new EventEmitter<void>();
  @Input() user: IUser;

  password: string;

  editUserForm: FormGroup;

  firstName: string;
  lastName: string;
  room: number;
  location: ILocation;
  changingLocation = false;
  locations: ILocation[] = [];
  isEmail: boolean;
  submitted = false;
  fieldMasks = ['FirstName', 'LastName', 'BirthDate', 'UserRoomId', 'IsEmailAllowed'];
  private notificationService: NotificationService;

  constructor(
    private userService: UserService,
    private translate: TranslateService,
    private dialogService: DialogService,
    private locationService: LocationService
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.getAllLocations();
    this.password = localStorage.getItem('password');
  }

  getAllLocations() {
    this.locationService.getLocation().subscribe(
      (data) => {
        this.locations = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  buildForm() {
    this.editUserForm = new FormGroup({
      firstName: new FormControl({value: this.user.firstName, disabled: false}, Validators.required),
      lastName: new FormControl({value: this.user.lastName, disabled: false}, Validators.required),
      birthDate: new FormControl({value: this.user.birthDate, disabled: false}),
      isEmail: new FormControl({value: this.user.isEmailAllowed, disabled: false}),
      room: new FormControl((this.user.userLocation.roomNumber) ? (this.user.userLocation.roomNumber) : 0,
        [Validators.required, Validators.maxLength(7)])
    });
  }

  onSubmit() {
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
      fieldMasks: this.fieldMasks
    };
    user.birthDate.setHours(12);
    user.userLocation.roomNumber = this.editUserForm.get('room').value;
    this.changeLocation();

    this.userService.editUser(user.id, user).subscribe(
      (data: boolean) => {
        this.onCancel.emit();
      },
      (error) => {
        this.notificationService.error(this.translate.instant('Something went wrong'), 'X');
      }
    );
    this.ngOnInit();
    this.editUserForm.reset();

  }

  newLocation(location: ILocation) {
    this.location = location;
    this.changingLocation = true;
  }

  changeLocation() {
    if (this.changingLocation) {
      this.user.userLocation.location = this.location;
      this.changingLocation = false;
    }
  }

  async cancel() {
    this.changingLocation = false;
    this.dialogService
      .openConfirmDialog(
        await this.translate.get('Are yo sure want to cancel?').toPromise()
      )
      .afterClosed()
      .subscribe(async (res) => {
        if (res) {
          this.onCancel.emit();
          this.editUserForm.reset();
        }
      });
  }

  onIsEmailChange(isChecked: boolean) {
    this.isEmail = isChecked;
  }
}
