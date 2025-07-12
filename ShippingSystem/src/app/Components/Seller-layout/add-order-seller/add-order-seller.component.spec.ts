import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrderSellerComponent } from './add-order-seller.component';

describe('AddOrderSellerComponent', () => {
  let component: AddOrderSellerComponent;
  let fixture: ComponentFixture<AddOrderSellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddOrderSellerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOrderSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
