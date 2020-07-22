import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoundBooksComponent } from './found-books.component';

describe('FoundBooksComponent', () => {
  let component: FoundBooksComponent;
  let fixture: ComponentFixture<FoundBooksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoundBooksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoundBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
