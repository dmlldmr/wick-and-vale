import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin-guard';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [

  { path: 'cart', loadComponent: () => import('./pages/cart/cart').then(m => m.CartPage), canActivate: [authGuard] },
  { path: 'checkout', loadComponent: () => import('./pages/checkout/checkout').then(m => m.CheckoutComponent), canActivate: [authGuard] },
  { path: 'order-confirmation/:id', loadComponent: () => import('./pages/order-confirmation/order-confirmation').then(m => m.OrderConfirmation), canActivate: [authGuard] },
  { path: 'orders', loadComponent: () => import('./pages/orders/orders/orders').then(m => m.Orders), canActivate: [authGuard] },
  { path: 'orders/:id', loadComponent: () => import('./pages/orders/order-detail/order-detail').then(m => m.OrderDetail), canActivate: [authGuard] },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
  { path: 'login', loadComponent: () => import('./pages/auth/login/login').then(m => m.Login) },
  { path: 'register', loadComponent: () => import('./pages/auth/register/register').then(m => m.Register) },

  { path: 'products', loadComponent: () => import('./pages/products/product-list/product-list').then(m => m.ProductList) },
  { path: 'products/:id', loadComponent: () => import('./pages/products/product-detail/product-detail').then(m => m.ProductDetail) },
  { path: 'collections/:id', loadComponent: () => import('./pages/collections/collection-detail/collection-detail').then(m => m.CollectionDetail) },

  { path: 'wishlist', loadComponent: () => import('./pages/wishlist/wishlist').then(m => m.WishlistPage), canActivate: [authGuard] },
  { path: 'profile', loadComponent: () => import('./pages/profile/profile').then(m => m.Profile), canActivate: [authGuard] },
  { path: 'change-password', loadComponent: () => import('./pages/profile/change-password/change-password').then(m => m.ChangePassword), canActivate: [authGuard] },
  { path: 'admin', loadComponent: () => import('./pages/admin/layout/admin-layout').then(m => m.AdminLayout), canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },

      { path: 'dashboard', loadComponent: () => import('./pages/admin/dashboard/admin-dashboard').then(m => m.AdminDashboard) },

      { path: 'products', loadComponent: () => import('./pages/admin/products/product-list/product-list').then(m => m.ProductList) },
      { path: 'products/new', loadComponent: () => import('./pages/admin/products/product-form/product-form').then(m => m.ProductsForm) },
      { path: 'products/edit/:id', loadComponent: () => import('./pages/admin/products/product-form/product-form').then(m => m.ProductsForm) },

      { path: 'collections', loadComponent: () => import('./pages/admin/collections/collection-list/collection-list').then(m => m.CollectionList) },
      { path: 'collections/new', loadComponent: () => import('./pages/admin/collections/collection-form/collection-form').then(m => m.CollectionForm) },
      { path: 'collections/edit/:id', loadComponent: () => import('./pages/admin/collections/collection-form/collection-form').then(m => m.CollectionForm) },

      { path: 'orders', loadComponent: () => import('./pages/admin/orders/order-list/order-list').then(m => m.OrderList) },
      { path: 'orders/:id', loadComponent: () => import('./pages/admin/orders/order-detail/order-detail').then(m => m.OrderDetail) },

      { path: 'users', loadComponent: () => import('./pages/admin/user/user-list/user-list').then(m => m.UserList) },
      { path: 'themes', loadComponent: () => import('./pages/admin/themes/theme-list/theme-list').then(m => m.ThemeList) },
    ]
  },
  { path: 'about',   loadComponent: () => import('./pages/about/about').then(m => m.About) },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact').then(m => m.Contact) },
  { path: 'faq',     loadComponent: () => import('./pages/faq/faq').then(m => m.Faq) },
  { path: 'privacy', loadComponent: () => import('./pages/privacy/privacy').then(m => m.Privacy) },
  { path: '**', redirectTo: 'home' }
];
