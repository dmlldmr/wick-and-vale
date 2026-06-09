package com.damla.wick_n_vale.review.service;

import com.damla.wick_n_vale.review.web.dto.CreateReviewRequest;
import com.damla.wick_n_vale.review.web.dto.ReviewResponse;

import java.util.List;

public interface ReviewService {
    List<ReviewResponse> getByProduct(Long productId);
    ReviewResponse create(Long productId, Long userId, CreateReviewRequest request);
    void delete(Long reviewId, Long requestId, boolean isAdmin);
}
