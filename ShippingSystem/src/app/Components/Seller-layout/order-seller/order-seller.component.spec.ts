import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSellerComponent } from './order-seller.component';

describe('OrderSellerComponent', () => {
  let component: OrderSellerComponent;
  let fixture: ComponentFixture<OrderSellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderSellerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
