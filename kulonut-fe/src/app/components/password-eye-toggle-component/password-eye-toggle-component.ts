import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-password-eye-toggle-component',
  imports: [MatButtonModule],
  templateUrl: './password-eye-toggle-component.html',
  styleUrls: [
    '../../app.scss',
    './password-eye-toggle-component.scss'
  ],
})
export class PasswordEyeToggleComponent {
  @Input() disabled = false;
  @Output() toggled = new EventEmitter<boolean>();

  protected visible = false;

  toggleVisibility() {
    this.visible = !this.visible;
    this.toggled.emit(this.visible);
  }
}
