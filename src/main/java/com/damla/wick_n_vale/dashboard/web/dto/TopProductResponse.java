package com.damla.wick_n_vale.dashboard.web.dto;

import java.math.BigDecimal;

public record TopProductResponse(
        Long productId,
        String productName,
        String imageUrl,
        BigDecimal price,
        Long totalSold
) {}
