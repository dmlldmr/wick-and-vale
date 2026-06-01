package com.damla.wick_n_vale.cart.web.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
public class CartResponse {
    private Long id;
    private List<CartItemResponse> items;
    private BigDecimal totalPrice;
    private int totalItems;
}
