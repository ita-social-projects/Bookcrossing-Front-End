import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { IGenre } from 'src/app/core/models/genre';
import { ILocation } from 'src/app/core/models/location';
import { LocationService } from 'src/app/core/services/location/location.service';
import { GenreService } from 'src/app/core/services/genre/genre';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/core/services/notification/notification.service';

@Component({
  selector: 'app-book-filter-bar',
  templateUrl: './book-filter-bar.component.html',
  styleUrls: ['./book-filter-bar.component.scss']
})
export class BookFilterBarComponent implements OnInit {
  @Output() filterChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() selectedGenresChange: EventEmitter<number[]> = new EventEmitter<number[]>();
  @Output() selectedLocationChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() availableSelectedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  genres: IGenre[]
  locations: ILocation[];
  @Input() selectedGenres: number[]
  @Input() selectedLocation: number;
  @Input() availableSelected?: boolean;
  @Input() showAvailable: boolean = true;
  constructor(
    private genreService: GenreService,
    private locationService: LocationService,
    private translate: TranslateService,
    private notificationService: NotificationService, ) { }

  ngOnInit(): void {
    this.getAllGenres();
    this.getLocation();
  }
  notifyFilterChange() {
    this.filterChange.emit(true);

  }
  //Categories
  onCategoriesChange(isOpened: boolean) {
    if (!isOpened) {
      this.selectedGenresChange.emit(this.selectedGenres);
      this.notifyFilterChange();
    }
  }
  onCategoriesReset() {
    this.selectedGenresChange.emit([]);
    this.notifyFilterChange();
  }
  //Location
  onLocationChange() {
    this.selectedLocationChange.emit(this.selectedLocation);
    this.notifyFilterChange();
  }
  onLocationReset() {
    this.selectedLocationChange.emit(null);
    this.notifyFilterChange();
  }

  //Available
  toggleAvailable(selected) {
    this.availableSelected = selected;
    this.availableSelectedChange.emit(selected);
    this.notifyFilterChange();
  }

  getLocation() {
    this.locationService.getLocation().subscribe({
      next:(data) => {
        this.locations = data;
      },
      error: () => {
        this.notificationService.warn(this.translate
          .instant("An error has occured, please try again later!"), "X")
      }
    }
    );
  }
  getAllGenres() {
    this.genreService.getGenre().subscribe({
      next: (data) => {
        this.genres = data;
      },
      error: () => {
        this.notificationService.warn(this.translate
          .instant("An error has occured, please try again later!"), "X")
      }
    }
    );
  }
}
