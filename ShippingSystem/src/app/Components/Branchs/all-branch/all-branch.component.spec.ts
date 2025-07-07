import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllBranchComponent } from './all-branch.component';

describe('AllBranchComponent', () => {
  let component: AllBranchComponent;
  let fixture: ComponentFixture<AllBranchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllBranchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
