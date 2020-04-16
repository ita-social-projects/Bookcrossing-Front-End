import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ILocation } from 'src/app/core/models/location';
import { LocationService } from 'src/app/core/services/location/location.service';

@Component({
  selector: 'app-view-location',
  templateUrl: './view-location.component.html',
  styleUrls: ['./view-location.component.scss'],
})
export class ViewLocationComponent implements OnInit {
  @Output() editEvent = new EventEmitter<ILocation>();
  @Input() isAdmin: boolean;

  locations: ILocation[] = [];
  searchField: string = '';
  constructor(private locationService: LocationService) {
    this.locationService.locationSubmited$.subscribe((location) => {
      const editedLocation = this.locations.find((x) => x.id === location.id);
      if (editedLocation) {
        const index = this.locations.indexOf(editedLocation);
        this.locations[index] = location;
      } else {
        this.locations.push(location);
      }
    });
  }

  ngOnInit(): void {
    this.getLocation();
  }

  getLocation() {
    this.locationService.getLocation().subscribe(
      (data) => {
        this.locations = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onDeleteLocation(id: number, index: number) {
    this.locationService.deleteLocation(id).subscribe(
      (result) => {
        console.log(result);
        this.locations.splice(index, 1);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onEditLocation(location: ILocation, index: number) {
    this.editEvent.emit(location);
  }
}
