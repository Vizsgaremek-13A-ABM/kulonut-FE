import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicInformationManagerPage } from './basic-information-manager-page';

describe('BasicInformationManagerPage', () => {
  let component: BasicInformationManagerPage;
  let fixture: ComponentFixture<BasicInformationManagerPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicInformationManagerPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicInformationManagerPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
