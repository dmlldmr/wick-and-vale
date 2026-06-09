package com.damla.wick_n_vale.cart.service.impl;

import com.damla.wick_n_vale.cart.entity.CartEntity;
import com.damla.wick_n_vale.cart.entity.CartItemEntity;
import com.damla.wick_n_vale.cart.repository.CartItemRepository;
import com.damla.wick_n_vale.cart.repository.CartRepository;
import com.damla.wick_n_vale.cart.service.CartService;
import com.damla.wick_n_vale.cart.web.dto.AddToCartRequest;
import com.damla.wick_n_vale.cart.web.dto.CartItemResponse;
import com.damla.wick_n_vale.cart.web.dto.CartResponse;
import com.damla.wick_n_vale.cart.web.dto.UpdateCartItemRequest;
import com.damla.wick_n_vale.common.exception.ResourceNotFoundException;
import com.damla.wick_n_vale.product.entity.ProductEntity;
import com.damla.wick_n_vale.product.repository.ProductRepository;
import com.damla.wick_n_vale.user.entity.UserEntity;
import com.damla.wick_n_vale.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    public CartResponse getCart(Long userId) {
        CartEntity cart = getOrCreateCart(userId);
        return toResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse addItem(Long userId, AddToCartRequest request) {
        CartEntity cart = getOrCreateCart(userId);
        ProductEntity product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if(product.getStock() < request.getQuantity()) {
            throw new IllegalStateException("Yeterli stok yok");
        }

        cartItemRepository.findByCartAndProductId(cart, product.getId())
                .ifPresentOrElse(
                        item -> {
                            int newQty = item.getQuantity() + request.getQuantity();
                            if(product.getStock() < newQty) throw new IllegalStateException("Yeterli stok yok");
                            item.setQuantity(newQty);
                            cartItemRepository.save(item);
                        },
                        () -> {
                            CartItemEntity item = new CartItemEntity();
                            item.setCart(cart);
                            item.setProduct(product);
                            item.setQuantity(request.getQuantity());
                            cart.getItems().add(item);
                        }
                );

        cartRepository.save(cart);
        return toResponse(cart);
    }

    @Override
    public CartResponse updateItem(Long userId, Long productId, UpdateCartItemRequest request) {
        CartEntity cart = getOrCreateCart(userId);

        CartItemEntity item = cartItemRepository.findByCartAndProductId(cart, productId)
                .orElseThrow(() -> new ResourceNotFoundException("Sepette ürün bulunamadı"));

        if(request.getQuantity() == 0) {
            cart.getItems().remove(item);
            cartItemRepository.delete(item);
        } else {
            if(item.getProduct().getStock() < request.getQuantity()) {
                throw new IllegalStateException("Yeterli stok yok");
            }
            item.setQuantity(request.getQuantity());
            cartItemRepository.save(item);
        }
        cartRepository.save(cart);
        return toResponse(cart);
    }

    @Override
    public void removeItem(Long userId, Long productId) {
        CartEntity cart = getOrCreateCart(userId);
        CartItemEntity item = cartItemRepository.findByCartAndProductId(cart, productId)
                .orElseThrow(() -> new ResourceNotFoundException("Sepette ürün bulunamadı"));
        cart.getItems().remove(item);
        cartItemRepository.delete(item);
    }

    @Override
    public void clearCart(Long userId) {
        CartEntity cart = getOrCreateCart(userId);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    private CartEntity getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            UserEntity user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            CartEntity cart = new CartEntity();
            cart.setUser(user);
            return cartRepository.save(cart);
        });
    }

    private CartResponse toResponse(CartEntity cart) {
        List<CartItemResponse> itemResponses = cart.getItems().stream()
                .map(item -> {
                    BigDecimal price = item.getProduct().getPrice();
                    return CartItemResponse.builder()
                            .productId(item.getProduct().getId())
                            .name(item.getProduct().getName())
                            .imageUrl(item.getProduct().getImageUrl())
                            .collectionType(item.getProduct().getVariant().getCollection().getCollectionType().name())
                            .variantType(item.getProduct().getVariant().getVariantType().name())
                            .price(price)
                            .quantity(item.getQuantity())
                            .subtotal(price.multiply(BigDecimal.valueOf(item.getQuantity())))
                            .build();
                })
                .toList();

        BigDecimal total = itemResponses.stream()
                .map(CartItemResponse::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        int totalItems = itemResponses.stream().mapToInt(CartItemResponse::getQuantity).sum();

        return CartResponse.builder()
                .id(cart.getId())
                .items(itemResponses)
                .totalPrice(total)
                .totalItems(totalItems)
                .build();
    }
}
