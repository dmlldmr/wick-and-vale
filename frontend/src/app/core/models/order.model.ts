export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
  imageUrl: string | null;
}

export interface Order {
  id: number;
  userId: number;
  customerName: string;
  customerEmail: string;
  address: string;
  totalPrice: number;
  orderStatus: string;
  paymentStatus: string;
  cargoTrackNumber: string;
  items: OrderItem[];
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface UpdateOrderStatusRequest {
  orderStatus: string;
  paymentStatus: string;
  cargoTrackNumber: string;
}

export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

export interface CreateOrderRequest {
  userId?: number;
  address: string;
  items: OrderItemRequest[];
}
