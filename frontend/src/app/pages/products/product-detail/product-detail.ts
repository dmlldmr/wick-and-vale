import {signal, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {Product} from '../../../core/models/product.model';
import {ProductService} from '../../../core/services/product';
import {CartService} from '../../../core/services/cart';
import {Auth} from '../../../core/services/auth';
import {ToastrAction} from '../../../core/state/actions/toastr.actions';
import {Store} from '@ngxs/store';
import {Review} from '../../../core/models/review.model';
import {FormsModule} from '@angular/forms';
import {ReviewService} from '../../../core/services/review';
import {WishlistService} from '../../../core/services/wishlist';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.scss']
})
export class ProductDetail implements OnInit {
  product = signal<Product | null>(null);
  loading = signal(true);
  error = signal(false);
  quantity = signal(1);
  adding = signal(false);
  relatedProducts = signal<Product[]>([]);

  reviews = signal<Review[]>([]);
  submitting = signal(false);
  newRating = 0;
  newComment = '';
  hoverRating = 0;

  wishlistLoading = signal(false);

  readonly collectionLabels: Record<string, string> = {
    BODUL: 'Bodul Mum', SUTUN: 'Sütun Mum', KUTU: 'Kutu Mum'
  };
  readonly variantLabels: Record<string, string> = {
    SADE: 'Sade', DESENLI: 'Desenli', INCE: 'İnce',
    KALIN: 'Kalın', KAGIT: 'Kağıt Kutulu', TENEKE: 'Teneke Kutulu'
  };
  readonly themeLabels: Record<string, string> = {
    SOFT: 'Soft', OLD: 'Old', VINTAGE: 'Vintage'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private authService: Auth,
    private reviewService: ReviewService,
    private wishlistService: WishlistService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.loading.set(true);
      this.error.set(false);
      this.reviews.set([]);
      this.relatedProducts.set([]);
      this.quantity.set(1);

      this.productService.getById(id).subscribe({
        next: (p) => {
          this.product.set(p);
          this.loading.set(false);
          this.loadRelated(p);
          this.loadReviews(p.id);
        },
        error: () => {
          this.error.set(true);
          this.loading.set(false);
        }
      });

      if (this.authService.isLoggedIn()) {
        this.wishlistService.load().subscribe();
      }
    });
  }


  private loadRelated(product: Product): void {
    this.productService.getByCollection(product.collectionType, 0, 5).subscribe({
      next: (res) => {
        this.relatedProducts.set(res.content.filter(p => p.id !== product.id).slice(0, 4));
      },
      error: () => {}
    });
  }

  loadReviews(productId: number): void {
    this.reviewService.getByProduct(productId).subscribe({
      next: (data) => this.reviews.set(data),
      error: () => {}
    });
  }

  changeQuantity(delta: number) {
    const next = this.quantity() + delta;
    const max = this.product()?.stock ?? 1;
    if (next >= 1 && next <= max) this.quantity.set(next);
  }

  addToCart() {
    if (!this.authService.isLoggedIn()) { this.router.navigate(['/login']); return; }
    const p = this.product();
    if (!p || this.adding()) return;
    this.adding.set(true);
    this.cartService.addItem(p.id, this.quantity()).subscribe({
      next: () => {
        this.adding.set(false);
        this.store.dispatch(new ToastrAction({ type: 'success', message: 'Ürün sepete eklendi.', delay: 2000 }));
      },
      error: () => { this.adding.set(false); }
    });
  }

  toggleWishlist(): void {
    if (!this.authService.isLoggedIn()) { this.router.navigate(['/login']); return; }
    const id = this.product()?.id;
    if (!id || this.wishlistLoading()) return;
    this.wishlistLoading.set(true);
    const action$ = this.wishlistService.isInWishlist(id)
      ? this.wishlistService.remove(id)
      : this.wishlistService.add(id);
    action$.subscribe({ next: () => this.wishlistLoading.set(false), error: () => this.wishlistLoading.set(false) });
  }

  get isWishlisted(): boolean {
    const id = this.product()?.id;
    return id ? this.wishlistService.isInWishlist(id) : false;
  }

  submitReview(): void {
    if (!this.authService.isLoggedIn()) { this.router.navigate(['/login']); return; }
    const productId = this.product()?.id;
    if (!productId || this.newRating === 0 || !this.newComment.trim()) return;
    this.submitting.set(true);
    this.reviewService.create(productId, { rating: this.newRating, comment: this.newComment }).subscribe({
      next: (review) => {
        this.reviews.update(list => [review, ...list]);
        this.newRating = 0;
        this.newComment = '';
        this.submitting.set(false);
      },
      error: () => { this.submitting.set(false); }
    });
  }

  deleteReview(reviewId: number): void {
    this.reviewService.delete(reviewId).subscribe({
      next: () => this.reviews.update(list => list.filter(r => r.id !== reviewId)),
      error: () => {}
    });
  }

  canDelete(review: Review): boolean {
    const user = this.authService.getCurrentUser();
    if (!user) return false;
    return user.id === review.userId || this.authService.isAdmin();
  }

  averageRating(): number {
    const list = this.reviews();
    if (!list.length) return 0;
    return list.reduce((sum, r) => sum + r.rating, 0) / list.length;
  }

  stars(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < Math.round(rating));
  }

  collectionLabel(type: string): string { return this.collectionLabels[type] ?? type; }
  variantLabel(type: string): string { return this.variantLabels[type] ?? type; }
  themeLabel(type: string): string { return this.themeLabels[type] ?? type; }

  get isLoggedIn(): boolean { return this.authService.isLoggedIn(); }
  get currentUserId(): number | null { return this.authService.getCurrentUser()?.id ?? null; }
  get alreadyReviewed(): boolean { return this.reviews().some(r => r.userId === this.currentUserId); }
  get inStock(): boolean { return (this.product()?.stock ?? 0) > 0; }
}
