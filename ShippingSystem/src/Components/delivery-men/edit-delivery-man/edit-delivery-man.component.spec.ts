import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDeliveryManComponent } from './edit-delivery-man.component';

describe('EditDeliveryManComponent', () => {
  let component: EditDeliveryManComponent;
  let fixture: ComponentFixture<EditDeliveryManComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDeliveryManComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDeliveryManComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
