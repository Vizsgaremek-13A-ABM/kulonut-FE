import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneProjectPage } from './one-project-page';

describe('OneProjectPage', () => {
  let component: OneProjectPage;
  let fixture: ComponentFixture<OneProjectPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OneProjectPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OneProjectPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
