import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBranchComponent } from './add-branch.component';

describe('AddBranchComponent', () => {
  let component: AddBranchComponent;
  let fixture: ComponentFixture<AddBranchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBranchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
