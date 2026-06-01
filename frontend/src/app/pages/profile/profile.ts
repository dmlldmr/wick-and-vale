import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {Auth} from '../../core/services/auth';

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
  success = '';
  error = '';

  constructor(public authService: Auth) {}

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
    this.success = '';
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
    this.success = '';

    this.authService.updateProfile(this.editName.trim(), this.editEmail.trim()).subscribe({
      next: (response) => {
        this.success = 'Profil başarıyla güncellendi!';
        this.isEditing = false;
        this.loading = false;

        // 🔥 Sayfayı yenile (navbar'daki isim güncellenir)
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      },
      error: (err) => {
        this.error = err.error?.message || 'Bir hata oluştu.';
        this.loading = false;
      }
    });
  }
  getRoleLabel(role: string): string {
    switch(role) {
      case 'ADMIN': return 'Admin';
      case 'ROLE_ADMIN': return 'Admin';
      case 'USER': return 'Kullanıcı';
      default: return role;
    }
  }
}
