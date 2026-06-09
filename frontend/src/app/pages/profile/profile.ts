import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {Auth} from '../../core/services/auth';
import {ToastrAction} from '../../core/state/actions/toastr.actions';
import {Store} from '@ngxs/store';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class Profile implements OnInit {
  user: any = null;
  isEditing = false;
  editName = '';
  editEmail = '';
  loading = false;
  error = '';

  constructor(
    public authService: Auth,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.user = this.authService.getCurrentUser();
    this.editName = this.user?.name || '';
    this.editEmail = this.user?.email || '';
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    this.error = '';
    if (this.isEditing) {
      this.editName = this.user?.name || '';
      this.editEmail = this.user?.email || '';
    }
  }

  saveProfile(): void {
    if (!this.editName.trim()) {
      this.error = 'İsim alanı boş olamaz.';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.updateProfile(this.editName.trim(), this.editEmail.trim()).subscribe({
      next: () => {
        this.loading = false;
        this.isEditing = false;
        this.store.dispatch(new ToastrAction({
          type: 'success',
          message: 'Profil başarıyla güncellendi.',
          delay: 2000
        }));
        setTimeout(() => window.location.reload(), 1500);
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getRoleLabel(role: string): string {
    switch (role) {
      case 'ADMIN': return 'Admin';
      case 'ROLE_ADMIN': return 'Admin';
      case 'USER': return 'Kullanıcı';
      default: return role;
    }
  }
}
