import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllDeliveryMenComponent } from './all-delivery-men.component';

describe('AllDeliveryMenComponent', () => {
  let component: AllDeliveryMenComponent;
  let fixture: ComponentFixture<AllDeliveryMenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllDeliveryMenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllDeliveryMenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
