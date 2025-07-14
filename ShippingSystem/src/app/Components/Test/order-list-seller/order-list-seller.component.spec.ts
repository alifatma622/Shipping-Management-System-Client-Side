import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderListSellerComponent } from './order-list-seller.component';

describe('OrderListSellerComponent', () => {
  let component: OrderListSellerComponent;
  let fixture: ComponentFixture<OrderListSellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderListSellerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderListSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
