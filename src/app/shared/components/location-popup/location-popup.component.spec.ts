import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationPopupComponent } from './location-popup.component';

describe('LocationPopupComponent', () => {
  let component: LocationPopupComponent;
  let fixture: ComponentFixture<LocationPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
