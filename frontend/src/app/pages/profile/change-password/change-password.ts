import {Component, NgZone, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {Auth} from '../../../core/services/auth';
import {Store} from '@ngxs/store';
import {ToastrAction} from '../../../core/state/actions/toastr.actions';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.scss'
})
export class ChangePassword {
  form: FormGroup;
  submitting = signal(false);
  error = signal('');

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router,
    private store: Store,
    private ngZone: NgZone
  ) {
    this.form = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });
  }

  get passwordMismatch(): boolean {
    const { newPassword, confirmPassword } = this.form.value;
    return confirmPassword && newPassword !== confirmPassword;
  }

  submit() {
    if (this.form.invalid || this.passwordMismatch || this.submitting()) return;

    const { currentPassword, newPassword } = this.form.value;
    this.submitting.set(true);
    this.error.set('');

    this.authService.changePassword(currentPassword, newPassword).subscribe({
      next: () => this.ngZone.run(() => {
        this.submitting.set(false);
        this.store.dispatch(new ToastrAction({
          type: 'success',
          message: 'Şifreniz başarıyla değiştirildi.',
          delay: 3000
        }));
        this.router.navigate(['/profile']);
      }),
      error: () => this.ngZone.run(() => {
        this.submitting.set(false);
      })
    });
  }
}
