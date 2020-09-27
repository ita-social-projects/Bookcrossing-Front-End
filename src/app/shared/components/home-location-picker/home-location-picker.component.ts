import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ILocation } from 'src/app/core/models/location';
import { ILocationHomePost } from 'src/app/core/models/locationHomePost';
import { IUserInfo } from 'src/app/core/models/userInfo';
import { LocationHomeService } from 'src/app/core/services/locationHome/locationHome.service';
import { MapboxService } from 'src/app/core/services/mapbox/mapbox.service';
@Component({
  selector: 'app-home-location-picker',
  templateUrl: './home-location-picker.component.html',
  styleUrls: ['./home-location-picker.component.scss']
})
export class HomeLocationPickerComponent implements OnInit {
  @Input() isDialog = true;
  public address: ILocation;
  public locationHomePost: ILocationHomePost;
  constructor(
    @Inject(MAT_DIALOG_DATA) public userId: number,
    public dialogRef: MatDialogRef<HomeLocationPickerComponent>,
    private mapboxService: MapboxService,
    private locationHomeService: LocationHomeService
    ) {
      mapboxService.currentAddressChanged$.subscribe((address) => {
        this.address = address;
        this.locationHomePost = {
          city : this.address.city,
          street : this.address.street,
          isActive: false,
          latitude: this.mapboxService.lat,
          longitude: this.mapboxService.lng,
          UserId: this.userId,
        };
      });
    }

  ngOnInit(): void {
    this.locationHomeService.locationHomePost$.subscribe(location => {
      this.locationHomePost = location;
    });
  }
  public saveLocation(): void {
    this.locationHomePost.isActive = true;
    this.locationHomeService.submitLocationHomePost(this.locationHomePost);
    console.log(this.isDialog);
    if (this.isDialog) {
      this.dialogRef.close(true);
    }
  }

}
