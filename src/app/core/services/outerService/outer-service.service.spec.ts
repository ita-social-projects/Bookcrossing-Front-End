import { TestBed } from '@angular/core/testing';

import { OuterServiceService } from './outer-service.service';

describe('OuterServiceService', () => {
  let service: OuterServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OuterServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
