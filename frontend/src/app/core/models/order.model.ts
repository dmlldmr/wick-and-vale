export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
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
