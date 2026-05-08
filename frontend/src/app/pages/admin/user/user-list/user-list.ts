import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {User} from '../../../../core/models/user.model';
import {UserService} from '../../../../core/services/user';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss'
})
export class UserList implements OnInit {
  users: User[] = [];
  loading = true;
  error = '';

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.userService.getAll().subscribe({
      next: (data) => { this.users = data; this.loading = false; },
      error: () => { this.error = 'Kullanıcılar yüklenemedi.'; this.loading = false; }
    });
  }

  delete(user: User) {
    if (!confirm(`${user.name} kullanıcısını islmek istediğine emin misin?`)) return;
    this.userService.delete(user.id).subscribe({
      next: () => this.load(),
      error: () => alert('Kullanıcı silinemedi.')
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('tr-TR');
  }
}
