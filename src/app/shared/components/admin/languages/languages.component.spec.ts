import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookLanguagesComponent } from './languages.component';

describe('LanguagesComponent', () => {
  let component: BookLanguagesComponent;
  let fixture: ComponentFixture<BookLanguagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookLanguagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookLanguagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
