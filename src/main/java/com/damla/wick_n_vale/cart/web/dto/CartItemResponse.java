package com.damla.wick_n_vale.cart.web.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
public class CartItemResponse {
    private Long productId;
    private String name;
    private String imageUrl;
    private String collectionType;
    private String variantType;
    private BigDecimal price;
    private int quantity;
    private BigDecimal subtotal;
}
