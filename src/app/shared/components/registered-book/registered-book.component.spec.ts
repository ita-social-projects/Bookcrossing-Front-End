import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredBookComponent } from './registered-book.component';

describe('RegisteredBookComponent', () => {
  let component: RegisteredBookComponent;
  let fixture: ComponentFixture<RegisteredBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisteredBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisteredBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
