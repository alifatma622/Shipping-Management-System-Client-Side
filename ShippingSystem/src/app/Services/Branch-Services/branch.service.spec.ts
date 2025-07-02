import { TestBed } from '@angular/core/testing';

import { BranchService } from './Branch-Services/branch.service';

describe('BranchService', () => {
  let service: BranchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BranchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
