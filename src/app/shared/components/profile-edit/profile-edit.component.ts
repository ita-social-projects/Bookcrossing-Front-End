import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IUser} from '../../../core/models/user';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {IRoomLocation} from '../../../core/models/roomLocation';
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
  @Input() isEditing: boolean;
  password: string;

  editUserForm: FormGroup;

  firstName: string;
  lastName: string;
  rooms: IRoomLocation[] = [];
  location: ILocation;
  locations: ILocation[] = [];
  submitted = false;
  fieldMasks = ['FirstName', 'LastName', 'BirthDate'];
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
      birthDate: new FormControl({value: this.user.birthDate, disabled: false})
      /*userLocation: new FormControl({value: this.user.userLocation, disabled: false})*/
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
      birthDate: /*this.user.birthDate,*/ this.editUserForm.get('birthDate').value,
      email: this.user.email,
      password: this.password,
      registeredDate: this.user.registeredDate,
      userRoomId: this.user.userLocation,
      roleId: this.user.role.id,
      fieldMasks: this.fieldMasks
    };
    console.log(user);
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

  /*getFormData(user: IUserPut): FormData {
    const formData = new FormData();
    Object.keys(user).forEach((key, index) => {
      if (user[key]) {
        if (Array.isArray(user[key])) {
          user[key].forEach((i, index) => {
            if (key == 'fieldMasks') {
              console.log(`${key}[${index}]` + ' ' + user[key][index]);
              formData.append(`${key}[${index}]`, user[key][index]);
            } else{
              console.log(`${key}[${index}][id]` + ' ' + user[key][index]['id']);
              formData.append(`${key}[${index}][id]`, user[key][index]['id']);
            }
          });
        } else {
          console.log(key + ' ' + user[key]);
          formData.append(key, user[key]);
        }
      }
    });
    return formData;
  }*/

  async cancel() {
    this.isEditing = false;
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
}
