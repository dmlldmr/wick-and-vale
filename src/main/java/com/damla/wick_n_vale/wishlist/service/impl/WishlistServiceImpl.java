package com.damla.wick_n_vale.wishlist.service.impl;

import com.damla.wick_n_vale.common.exception.ResourceNotFoundException;
import com.damla.wick_n_vale.product.entity.ProductEntity;
import com.damla.wick_n_vale.product.repository.ProductRepository;
import com.damla.wick_n_vale.user.entity.UserEntity;
import com.damla.wick_n_vale.user.repository.UserRepository;
import com.damla.wick_n_vale.wishlist.entity.WishlistEntity;
import com.damla.wick_n_vale.wishlist.repository.WishlistRepository;
import com.damla.wick_n_vale.wishlist.service.WishlistService;
import com.damla.wick_n_vale.wishlist.web.dto.WishlistItemResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Override
    public List<WishlistItemResponse> getByUser(Long userId) {
        return wishlistRepository.findByUserId(userId)
                .stream()
                .map(w -> toResponse(w.getProduct()))
                .toList();
    }

    @Override
    public void add(Long productId, Long userId) {
        if (wishlistRepository.existsByUserIdAndProductId(userId, productId)) return;

        ProductEntity product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        wishlistRepository.save(WishlistEntity.builder().user(user).product(product).build());
    }

    @Override
    @Transactional
    public void remove(Long productId, Long userId) {
        wishlistRepository.deleteByUserIdAndProductId(userId, productId);
    }

    private WishlistItemResponse toResponse(ProductEntity p) {
        return new WishlistItemResponse(
                p.getId(),
                p.getName(),
                p.getImageUrl(),
                p.getPrice(),
                p.getStock(),
                p.getVariant().getCollection().getCollectionType().name(),
                p.getVariant().getVariantType().name(),
                p.getTheme().getThemeType()
        );
    }
}
