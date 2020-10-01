import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
  })
export class SearchBarService {

    private currentTermSubject: BehaviorSubject<string>;
    public currentTerm: Observable<string>;
  constructor( ) {
        this.currentTermSubject = new BehaviorSubject<string>(null);
        this.currentTerm = this.currentTermSubject.asObservable();
    }

  changeSearchTerm(term: string) {
    this.currentTermSubject.next(term);
  }
}
