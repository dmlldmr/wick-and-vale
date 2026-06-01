package com.damla.wick_n_vale.cart.web.controller;

import com.damla.wick_n_vale.cart.service.CartService;
import com.damla.wick_n_vale.cart.web.dto.AddToCartRequest;
import com.damla.wick_n_vale.cart.web.dto.CartResponse;
import com.damla.wick_n_vale.cart.web.dto.UpdateCartItemRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartResponse> getCart(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(cartService.getCart(getUserId(user)));
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addItem(
            @AuthenticationPrincipal UserDetails user,
            @RequestBody @Valid AddToCartRequest request) {
        return ResponseEntity.ok(cartService.addItem(getUserId(user), request));
    }

    @PatchMapping("/items/{productId}")
    public ResponseEntity<CartResponse> updateItem(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long productId,
            @RequestBody @Valid UpdateCartItemRequest request) {
        return ResponseEntity.ok(cartService.updateItem(getUserId(user), productId, request));
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<Void> removeIItem(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long productId) {
        cartService.removeItem(getUserId(user), productId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal UserDetails user) {
        cartService.clearCart(getUserId(user));
        return ResponseEntity.noContent().build();
    }

    private Long getUserId(UserDetails user) {
        return Long.parseLong(user.getUsername());
    }


}
