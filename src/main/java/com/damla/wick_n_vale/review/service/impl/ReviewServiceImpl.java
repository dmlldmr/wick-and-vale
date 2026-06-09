package com.damla.wick_n_vale.review.service.impl;

import com.damla.wick_n_vale.common.exception.InvalidOperationException;
import com.damla.wick_n_vale.common.exception.ResourceNotFoundException;
import com.damla.wick_n_vale.product.entity.ProductEntity;
import com.damla.wick_n_vale.product.repository.ProductRepository;
import com.damla.wick_n_vale.review.entity.ReviewEntity;
import com.damla.wick_n_vale.review.repository.ReviewRepository;
import com.damla.wick_n_vale.review.service.ReviewService;
import com.damla.wick_n_vale.review.web.dto.CreateReviewRequest;
import com.damla.wick_n_vale.review.web.dto.ReviewResponse;
import com.damla.wick_n_vale.user.entity.UserEntity;
import com.damla.wick_n_vale.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {
    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public List<ReviewResponse> getByProduct(Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public ReviewResponse create(Long productId, Long userId, CreateReviewRequest request) {
        if(reviewRepository.existsByProductIdAndUserId(productId, userId)) {
            throw new InvalidOperationException("Bu ürün için zaten bir yorum yazdınız.");
        }

        ProductEntity product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Ürün bulunamadı."));
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı."));

        ReviewEntity review = ReviewEntity.builder()
                .product(product)
                .user(user)
                .rating(request.rating())
                .comment(request.comment())
                .build();
        return toResponse(reviewRepository.save(review));
    }

    @Override
    public void delete(Long reviewId, Long requestId, boolean isAdmin) {
        ReviewEntity review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Yorum bulunamadı."));

        if(!isAdmin && !review.getUser().getId().equals(requestId)) {
            throw new InvalidOperationException("Bu yorumu silme yetkiniz yok.");
        }
        reviewRepository.delete(review);
    }

    private ReviewResponse toResponse(ReviewEntity r) {
        return new ReviewResponse(
                r.getId(),
                r.getUser().getId(),
                r.getUser().getName(),
                r.getRating(),
                r.getComment(),
                r.getCreatedAt()
        );
    }
}
