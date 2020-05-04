import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentOwnedBooksComponent } from './current-owned-books.component';

describe('CurrentOwnedBooksComponent', () => {
  let component: CurrentOwnedBooksComponent;
  let fixture: ComponentFixture<CurrentOwnedBooksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentOwnedBooksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentOwnedBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
