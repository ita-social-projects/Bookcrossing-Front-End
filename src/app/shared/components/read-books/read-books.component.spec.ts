import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadBooksComponent } from './read-books.component';

describe('ReadBooksComponent', () => {
  let component: ReadBooksComponent;
  let fixture: ComponentFixture<ReadBooksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadBooksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
