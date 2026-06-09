export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  stock: number;
  themeId: number;
  variantId: number;
  // imageUrl backend tarafından set edilecek, frontend göndermiyor
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  themeId?: number;
  variantId?: number;
  // imageUrl backend tarafından set edilecek
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  imageUrl: string;
  themeId: number;
  themeType: string;
  variantId: number;
  variantType: string;
  collectionId: number;
  collectionType: string;
  createdAt: string;
  updatedAt: string;
  hasOrders: boolean;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
