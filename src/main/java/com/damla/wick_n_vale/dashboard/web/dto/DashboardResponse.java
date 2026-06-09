package com.damla.wick_n_vale.dashboard.web.dto;

import java.math.BigDecimal;
import java.util.List;

public record DashboardResponse(
        BigDecimal totalRevenue,
        long totalOrders,
        long pendingOrders,
        long shippedOrders,
        long processingOrders,
        long cancelledOrders,
        long deliveredOrders,
        long totalUsers,
        long totalProducts,
        List<TopProductResponse> topProducts
) {}
