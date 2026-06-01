package com.damla.wick_n_vale.cart.service;

import com.damla.wick_n_vale.cart.web.dto.AddToCartRequest;
import com.damla.wick_n_vale.cart.web.dto.CartResponse;
import com.damla.wick_n_vale.cart.web.dto.UpdateCartItemRequest;

public interface CartService {
    CartResponse getCart(Long userId);
    CartResponse addItem(Long userId, AddToCartRequest request);
    CartResponse updateItem(Long userId, Long productId, UpdateCartItemRequest request);
    void removeItem(Long userId, Long productId);
    void clearCart(Long userId);
}
