import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { IGenre } from 'src/app/core/models/genre';
import {ILanguage } from 'src/app/core/models/language';
import { ILocation } from 'src/app/core/models/location';
import { LocationService } from 'src/app/core/services/location/location.service';
import { GenreService } from 'src/app/core/services/genre/genre';
import {LanguageService } from 'src/app/core/services/language/language.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { MatButtonToggleChange } from '@angular/material/button-toggle/button-toggle';
import { BookLanguageService } from 'src/app/core/services/bookLanguage/bookLanguage';

@Component({
  selector: 'app-book-filter-bar',
  templateUrl: './book-filter-bar.component.html',
  styleUrls: ['./book-filter-bar.component.scss']
})
export class BookFilterBarComponent implements OnInit {
  @Output() filterChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() selectedGenresChange: EventEmitter<number[]> = new EventEmitter<number[]>();
  @Output() selectedLanguagesChange: EventEmitter<number[]> = new EventEmitter<number[]>();
  @Output() selectedLocationChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() availableSelectedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() viewMode: EventEmitter<string> = new EventEmitter<string>()
  @Output() orderByFieldChange:EventEmitter<string> = new EventEmitter<string>();
  @Output() orderByFieldAscendingChange:EventEmitter<boolean> = new EventEmitter<boolean>();
  genres: IGenre[];
  languages: ILanguage[];
  selectedMode: string;
  locations: ILocation[];
  @Input() selectedGenres: number[];
  @Input() selectedLanguages: number[];
  @Input() selectedLocation: number;
  @Input() availableSelected?: boolean;
  @Input() showAvailable: boolean = true;
  @Input() orderByField:string;
  @Input() orderByFieldAscending: boolean = true;
  constructor(
    private genreService: GenreService,
    private bookLanguageService: BookLanguageService,
    private locationService: LocationService,
    private translate: TranslateService,
    private notificationService: NotificationService, ) { }

  ngOnInit(): void {
    this.getAllGenres();
    this.getAllLanguages();
    this.getLocation();
    this.getViewMode();
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
  //Languages
  onLanguagesChange(isOpened: boolean) {
    if (!isOpened) {
      this.selectedLanguagesChange.emit(this.selectedLanguages);
      this.notifyFilterChange();
    }
  }
  onLanguagesReset() {
    this.selectedLanguagesChange.emit([]);
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
        this.notificationService.error(this.translate
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
        this.notificationService.error(this.translate
          .instant("An error has occured, please try again later!"), "X")
      }
    }
    );
  }

  getAllLanguages() {
    this.bookLanguageService.getLanguage().subscribe({
      next: (data) => {
        this.languages = data;
      },
      error: () => {
        this.notificationService.error(this.translate
          .instant("An error has occured, please try again later!"), "X")
      }
    }
    );
  }

  onViewModeChange(value: any) {
    localStorage.setItem("viewMode", value);
    this.getViewMode()
  }

  getViewMode() {
    if (localStorage.hasOwnProperty("viewMode")) {
      this.selectedMode = localStorage.getItem("viewMode");
      this.viewMode.emit(localStorage.getItem("viewMode"))
    }
    else{
      this.selectedMode = 'list'
      this.viewMode.emit("list")
    }
  }

  onOrderByFieldChange() {

    this.orderByFieldChange.emit(this.orderByField);
    this.notifyFilterChange();
  }

  onOrderByFieldReset() {
    this.orderByFieldChange.emit(null);
    this.notifyFilterChange();
  }

  onOrderByAscendingChange() {
    this.orderByFieldAscending= !this.orderByFieldAscending;
    this.orderByFieldAscendingChange.emit(this.orderByFieldAscending);
    this.notifyFilterChange();
  }
}
