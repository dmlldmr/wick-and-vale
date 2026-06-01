export interface CartItem {
  productId: number;
  name: string;
  imageUrl: string;
  collectionType: string;
  variantType: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
}
