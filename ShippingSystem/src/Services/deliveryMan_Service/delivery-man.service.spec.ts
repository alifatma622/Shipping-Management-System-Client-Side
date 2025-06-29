import { TestBed } from '@angular/core/testing';

import { DeliveryManService } from './delivery-man.service';

describe('DeliveryManService', () => {
  let service: DeliveryManService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliveryManService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
