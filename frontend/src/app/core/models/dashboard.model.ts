export interface TopProduct {
  productId: number;
  productName: string;
  imageUrl: string;
  price: number;
  totalSold: number
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalUsers: number;
  totalProducts: number;
  topProducts: TopProduct[];
}
