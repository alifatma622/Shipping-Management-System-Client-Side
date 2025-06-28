import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryMenListComponent } from './delivery-men-list.component';

describe('DeliveryMenListComponent', () => {
  let component: DeliveryMenListComponent;
  let fixture: ComponentFixture<DeliveryMenListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryMenListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryMenListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
