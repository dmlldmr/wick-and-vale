import { Routes } from '@angular/router';
import {adminGuard} from './core/guards/admin-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
  { path: 'login', loadComponent: () => import('./pages/auth/login/login').then(m => m.Login) },
  { path: 'register', loadComponent: () => import('./pages/auth/register/register').then(m => m.Register) },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/layout/admin-layout').then(m => m.AdminLayout),
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full'},
      { path: 'products', loadComponent: () => import('./pages/admin/dashboard/admin-dashboard').then(m => m.AdminDashboard) },
      { path: 'products/new', loadComponent: () => import('./pages/admin/products/product-form/product-form').then(m => m.ProductsForm) },
      { path: 'products/:id/edit', loadComponent: () => import('./pages/admin/products/product-form/product-form').then(m => m.ProductsForm)},
      { path: 'collections', loadComponent: () => import('./pages/admin/collections/collection-list/collection-list').then(m => m.CollectionList) },
      { path: 'collections/new', loadComponent: () => import('./pages/admin/collections/collection-form/collection-form').then(m => m.CollectionForm) },
      { path: 'collections/:id/edit', loadComponent: () => import('./pages/admin/collections/collection-form/collection-form').then(m => m.CollectionForm) },
      { path: 'orders', loadComponent: () => import('./pages/admin/orders/order-list/order-list').then(m => m.OrderList) },
      { path: 'orders/:id', loadComponent: () => import('./pages/admin/orders/order-detail/order-detail').then(m => m.OrderDetail) },
      { path: 'user', loadComponent: () => import('./pages/admin/user/user-list/user-list').then(m => m.UserList) },

    ]
  },
];
