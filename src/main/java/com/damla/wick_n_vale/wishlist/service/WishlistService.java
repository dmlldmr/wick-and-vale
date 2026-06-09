package com.damla.wick_n_vale.wishlist.service;

import com.damla.wick_n_vale.wishlist.web.dto.WishlistItemResponse;

import java.util.List;

public interface WishlistService {
    List<WishlistItemResponse> getByUser(Long userId);
    void add(Long productId, Long userId);
    void remove(Long productId, Long userId);
}
