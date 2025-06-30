import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDeliveryManComponent } from './add-delivery-man.component';

describe('AddDeliveryManComponent', () => {
  let component: AddDeliveryManComponent;
  let fixture: ComponentFixture<AddDeliveryManComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDeliveryManComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDeliveryManComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
