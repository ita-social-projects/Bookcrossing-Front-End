import {Component, ComponentFactoryResolver, OnInit, ViewChild} from '@angular/core';
import {IUser} from '../../../core/models/user';
import {UserService} from '../../../core/services/user/user.service';
import {AuthenticationService} from '../../../core/services/authentication/authentication.service';
import {ILocation} from '../../../core/models/location';
import {LocationService} from '../../../core/services/location/location.service';
import {RefDirective} from '../../directives/ref.derictive';
import {ProfileEditComponent} from '../profile-edit/profile-edit.component';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @ViewChild(RefDirective, {static: false}) refDir: RefDirective

  constructor(private userService: UserService,
              private authentication: AuthenticationService,
              private locationService: LocationService,
              private resolver: ComponentFactoryResolver) { }

  user: IUser;
  id: number;
  isEditing = false;
  locations: ILocation[];

  ngOnInit(): void {

    this.userInfo();
  }

  async getUserId(): Promise<number> {
    let recieve = 100;

    let promice = new Promise<number>((resolve) => {
      this.authentication.getUserId()
        .subscribe({
          next: (value: number) => {
            if (value) {
              resolve(value);
            }
          },
          error: () => {
            resolve(0);
          }
        });
    });

    await promice.then(value => this.id = value);
    console.log('id :' + this.id);

    return this.id;
  }

  async userInfo() {
    await this.getUserId().then(res => this.getUserById());
  }

  getUserById() {
    this.userService.getUserById(this.id)
    .subscribe(user_ => {
    this.user = user_;
  });
  }

  showEditForm(user: IUser) {
    this.isEditing = true;
    let formFactory = this.resolver.resolveComponentFactory(ProfileEditComponent);
    let instance = this.refDir.containerRef.createComponent(formFactory).instance;
    instance.user = user;
    instance.onCancel.subscribe(() => {this.refDir.containerRef.clear(); this.ngOnInit(); this.isEditing = false; });
  }
}
