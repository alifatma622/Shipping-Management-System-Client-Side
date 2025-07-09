import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AskedQuestionsComponent } from './asked-questions.component';

describe('AskedQuestionsComponent', () => {
  let component: AskedQuestionsComponent;
  let fixture: ComponentFixture<AskedQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AskedQuestionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AskedQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
