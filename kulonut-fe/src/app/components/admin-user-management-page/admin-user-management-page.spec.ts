import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserManagementPage } from './admin-user-management-page';

describe('AdminUserManagementPage', () => {
  let component: AdminUserManagementPage;
  let fixture: ComponentFixture<AdminUserManagementPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUserManagementPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUserManagementPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
