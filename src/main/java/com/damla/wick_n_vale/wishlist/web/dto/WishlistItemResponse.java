package com.damla.wick_n_vale.wishlist.web.dto;

import java.math.BigDecimal;

public record WishlistItemResponse(
        Long productId,
        String productName,
        String imageUrl,
        BigDecimal price,
        int stock,
        String collectionType,
        String variantType,
        String themeType
) {}
