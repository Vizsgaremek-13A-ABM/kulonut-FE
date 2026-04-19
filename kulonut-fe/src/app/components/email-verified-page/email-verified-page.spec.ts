import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailVerifiedPage } from './email-verified-page';

describe('EmailVerifiedPage', () => {
  let component: EmailVerifiedPage;
  let fixture: ComponentFixture<EmailVerifiedPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailVerifiedPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailVerifiedPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
