import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../../core/services/auth';
import {CartService} from '../../../core/services/cart';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class Navbar {
  constructor(public authService: Auth,
              private router: Router,
              public cartService: CartService
  ) {}

  ngOnInit() {
    if(this.authService.isLoggedIn()) {
      this.cartService.getCart().subscribe();
    }
  }

  logout() {
    this.authService.logout();
    this.cartService.cartCount.set(0);
    this.router.navigate(['/login']);
  }

  get currentUser() {
    return this.authService.getCurrentUser();
  }
}
