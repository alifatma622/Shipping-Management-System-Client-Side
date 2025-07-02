import { TestBed } from '@angular/core/testing';

import { CityServiceService } from './city-service.service';

describe('CityServiceService', () => {
  let service: CityServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CityServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
