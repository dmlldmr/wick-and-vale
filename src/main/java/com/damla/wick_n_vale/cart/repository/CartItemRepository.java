package com.damla.wick_n_vale.cart.repository;

import com.damla.wick_n_vale.cart.entity.CartEntity;
import com.damla.wick_n_vale.cart.entity.CartItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartItemRepository  extends JpaRepository<CartItemEntity, Long> {
    Optional<CartItemEntity> findByCartAndProductId(CartEntity cart, Long productId);
}
