import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverymanOrdersComponent } from './deliveryman-orders.component';

describe('DeliverymanOrdersComponent', () => {
  let component: DeliverymanOrdersComponent;
  let fixture: ComponentFixture<DeliverymanOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliverymanOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliverymanOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
