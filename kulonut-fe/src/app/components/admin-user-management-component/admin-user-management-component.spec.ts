import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserManagementComponent } from './admin-user-management-component';

describe('AdminUserManagementComponent', () => {
  let component: AdminUserManagementComponent;
  let fixture: ComponentFixture<AdminUserManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUserManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUserManagementComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
