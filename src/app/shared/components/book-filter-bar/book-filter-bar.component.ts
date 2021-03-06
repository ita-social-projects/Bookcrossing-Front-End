import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { IGenre } from 'src/app/core/models/genre';
import { ILanguage } from 'src/app/core/models/language';
import { ILocation } from 'src/app/core/models/location';
import { LocationService } from 'src/app/core/services/location/location.service';
import { GenreService } from 'src/app/core/services/genre/genre';
import { LanguageService } from 'src/app/core/services/language/language.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { BookLanguageService } from 'src/app/core/services/bookLanguage/bookLanguage.service';
import {BookService} from '../../../core/services/book/book.service';
import {ILocationFilter} from '../../../core/models/books-map/location-filter';
import { bookState } from 'src/app/core/models/bookState.enum';
import { ArrayDataSource } from '@angular/cdk/collections';
import { isString } from 'lodash';
import { ActivatedRoute } from '@angular/router';

export interface BookStateType {
  id: number;
  name: string;
  nameUk: string;
}

@Component({
  selector: 'app-book-filter-bar',
  templateUrl: './book-filter-bar.component.html',
  styleUrls: ['./book-filter-bar.component.scss']
})
export class BookFilterBarComponent implements OnInit {
  @Output() filterChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() selectedGenresChange: EventEmitter<number[]> = new EventEmitter<number[]>();
  @Output() showMapSelectedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() selectedLanguagesChange: EventEmitter<number[]> = new EventEmitter<number[]>();
  @Output() selectedLocationsChange: EventEmitter<ILocationFilter> = new EventEmitter<ILocationFilter>();
  @Output() availableSelectedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() selectedStatesChange: EventEmitter<bookState[]> = new EventEmitter<bookState[]>();
  @Output() viewMode: EventEmitter<string> = new EventEmitter<string>();
  @Output() orderByFieldChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() orderByFieldAscendingChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  genres: IGenre[];
  bookStates: bookState[];
  languages: ILanguage[];
  selectedMode: string;
  @Input() selectedStates: bookState[];
  @Input() selectedGenres: number[];
  @Input() selectedLanguages: number[];
  @Input() selectedLocations: ILocationFilter;
  @Input() availableSelected?: boolean;
  @Input() showMap = false;
  @Input() showMapSelected: boolean;
  @Input() showAvailable = true;
  @Input() orderByField: string;
  @Input() orderByFieldAscending = true;

  constructor(
    private route: ActivatedRoute,
    private languageService: LanguageService,
    private genreService: GenreService,
    private bookLanguageService: BookLanguageService,
    private locationService: LocationService,
    private translate: TranslateService,
    private bookService: BookService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.getAllGenres();
    this.getAllLanguages();
    this.getViewMode();
    if (this.selectedStates) {
      this.selectedStatesChange.emit(this.selectedStates);
    }
    this.bookStates = Object.keys(bookState).map(key => bookState[key]).filter(el => el !== 3 && !isString(el));
  }

  notifyFilterChange(isSurelyChanged: boolean) {
    this.filterChange.emit(isSurelyChanged);
  }

  // Categories
  onCategoriesChange(isOpened: boolean) {
    if (!isOpened &&  typeof this.selectedGenres !== 'undefined') {
      this.selectedGenresChange.emit(this.selectedGenres);
      this.notifyFilterChange(false);
    }
  }

  getCategoriesLanguage() {
    if (this.translate.currentLang === 'en') {
      this.genres?.sort((a, b) => (a.name > b.name) ? 1 : -1);
      return true;
    } else {
      this.genres?.sort((a, b) => (a.nameUk > b.nameUk) ? 1 : -1);
      return false;
    }
  }

  onCategoriesReset() {
    this.selectedGenresChange.emit([]);
    this.notifyFilterChange(true);
  }
  // Languages
  onLanguagesChange(isOpened: boolean) {
    if (!isOpened && typeof this.selectedLanguages !== 'undefined') {
      this.selectedLanguagesChange.emit(this.selectedLanguages);
      this.notifyFilterChange(false);
    }
  }
  onLanguagesReset() {
    this.selectedLanguagesChange.emit([]);
    this.notifyFilterChange(true);
  }

  onLocationChange(filter: ILocationFilter) {
    this.selectedLocations = filter;
    this.selectedLocationsChange.emit(this.selectedLocations);
    this.notifyFilterChange(false);
  }

  onLocationReset() {
    this.selectedLocationsChange.emit(null);
    this.notifyFilterChange(true);
  }

  public toggleMap(selected): void {
    this.showMapSelected = selected;
    this.showMapSelectedChange.emit(selected);
    if (!selected) {
      this.selectedLocations = null;
      this.selectedLocationsChange.emit(null);
      this.notifyFilterChange(false);
    }
  }

  onStatesChange(isOpened: boolean) {
    if (!isOpened && typeof this.selectedStates !== 'undefined') {
      this.selectedStatesChange.emit(this.selectedStates);
      this.notifyFilterChange(false);
    }
  }

  onStatesReset() {
    this.selectedStatesChange.emit([]);
    this.notifyFilterChange(true);
  }

  getAllGenres() {
    this.genreService.getGenre().subscribe({
      next: (data) => {
        this.genres = data;
      },
      error: () => {
        this.notificationService.error(this.translate
          .instant('An error has occured, please try again later!'), 'X');
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
          .instant('An error has occured, please try again later!'), 'X');
      }
    }
    );
  }

  onViewModeChange(value: any) {
    localStorage.setItem('viewMode', value);
    this.getViewMode();
  }

  getViewMode() {
    if (localStorage.hasOwnProperty('viewMode')) {
      this.selectedMode = localStorage.getItem('viewMode');
      this.viewMode.emit(localStorage.getItem('viewMode'));
    } else {
      this.selectedMode = 'list';
      this.viewMode.emit('list');
    }
  }

  onOrderByFieldChange() {
    this.orderByFieldChange.emit(this.orderByField);
    this.notifyFilterChange(true);
  }

  onOrderByFieldReset() {
    this.orderByFieldChange.emit(null);
    this.notifyFilterChange(true);
  }

  onOrderByCurrent()  {
    if  (this.orderByFieldAscending == null) {
      this.orderByFieldAscending = false;
    }
    this.orderByFieldAscendingChange.emit(this.orderByFieldAscending);
    this.notifyFilterChange(true);
  }

  onOrderByAscendingChange() {
    this.orderByFieldAscending = !this.orderByFieldAscending;
    this.orderByFieldAscendingChange.emit(this.orderByFieldAscending);
    this.notifyFilterChange(true);
  }

  public onFilterChange(filterChanged: boolean): void {
    if (filterChanged) {
      this.notifyFilterChange(true);
    }
  }
}
