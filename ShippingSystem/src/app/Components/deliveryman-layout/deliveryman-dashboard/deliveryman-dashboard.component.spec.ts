import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverymanDashboardComponent } from './deliveryman-dashboard.component';

describe('DeliverymanDashboardComponent', () => {
  let component: DeliverymanDashboardComponent;
  let fixture: ComponentFixture<DeliverymanDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliverymanDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliverymanDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
