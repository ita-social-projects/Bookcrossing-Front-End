import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeLocationPickerComponent } from './home-location-picker.component';

describe('HomeLocationPickerComponent', () => {
  let component: HomeLocationPickerComponent;
  let fixture: ComponentFixture<HomeLocationPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeLocationPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeLocationPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
