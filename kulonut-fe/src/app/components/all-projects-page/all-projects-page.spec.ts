import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllProjectsPage } from './all-projects-page';

describe('AllProjectsPage', () => {
  let component: AllProjectsPage;
  let fixture: ComponentFixture<AllProjectsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllProjectsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllProjectsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
