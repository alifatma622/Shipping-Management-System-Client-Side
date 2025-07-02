import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSellerComponent } from './edit-seller.component';

describe('EditSellerComponent', () => {
  let component: EditSellerComponent;
  let fixture: ComponentFixture<EditSellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSellerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
