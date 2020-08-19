import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IUserInfo } from '../../../core/models/userInfo';
import { UserService } from '../../../core/services/user/user.service';
import { AuthenticationService } from '../../../core/services/authentication/authentication.service';
import { ILocation } from '../../../core/models/location';
import { LocationService } from '../../../core/services/location/location.service';
import { RefDirective } from '../../directives/ref.derictive';
import { ProfileEditComponent } from '../profile-edit/profile-edit.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  @ViewChild(RefDirective, { static: false }) refDir: RefDirective;

  constructor(
    private userService: UserService,
    private authentication: AuthenticationService,
    private locationService: LocationService,
    private resolver: ComponentFactoryResolver
  ) {}

  public user: IUserInfo;
  public id: number;
  public isEditing = false;
  public locations: ILocation[];

  public ngOnInit(): void {
    this.userInfo();
  }

  public async getUserId(): Promise<number> {
    const recieve = 100;

    const promice = new Promise<number>((resolve) => {
      this.authentication.getUserId().subscribe({
        next: (value: number) => {
          if (value) {
            resolve(value);
          }
        },
        error: () => {
          resolve(0);
        },
      });
    });

    await promice.then((value) => (this.id = value));
    console.log('id :' + this.id);

    return this.id;
  }

  public async userInfo(): Promise<void> {
    await this.getUserId().then(() => this.getUserById());
  }

  public getUserById(): void {
    this.userService.getUserById(this.id).subscribe((user) => {
      this.user = user;
    });
  }

  public showEditForm(user: IUserInfo): void {
    this.isEditing = true;
    const formFactory = this.resolver.resolveComponentFactory(
      ProfileEditComponent
    );
    const instance = this.refDir.containerRef.createComponent(formFactory)
      .instance;
    instance.user = user;
    instance.cancel.subscribe(() => {
      this.refDir.containerRef.clear();
      this.ngOnInit();
      this.isEditing = false;
    });
  }
}
