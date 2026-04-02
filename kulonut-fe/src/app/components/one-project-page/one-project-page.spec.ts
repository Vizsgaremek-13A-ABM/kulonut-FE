import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneProjectPageComponent } from './one-project-page';

describe('OneProjectPageComponent', () => {
  let component: OneProjectPageComponent;
  let fixture: ComponentFixture<OneProjectPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OneProjectPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OneProjectPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
