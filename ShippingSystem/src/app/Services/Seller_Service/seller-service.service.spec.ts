import { TestBed } from '@angular/core/testing';

import { SellerServiceService } from './seller-service.service';

describe('SellerServiceService', () => {
  let service: SellerServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SellerServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
