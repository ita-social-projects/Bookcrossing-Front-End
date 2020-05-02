import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookFilterBarComponent } from './book-filter-bar.component';

describe('BookFilterBarComponent', () => {
  let component: BookFilterBarComponent;
  let fixture: ComponentFixture<BookFilterBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookFilterBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookFilterBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
