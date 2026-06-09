package com.damla.wick_n_vale.review.web.controller;

import com.damla.wick_n_vale.review.service.ReviewService;
import com.damla.wick_n_vale.review.web.dto.CreateReviewRequest;
import com.damla.wick_n_vale.review.web.dto.ReviewResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @GetMapping("/api/products/{productId}/reviews")
    public ResponseEntity<List<ReviewResponse>> getByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getByProduct(productId));
    }

    @PostMapping("/api/products/{productId}/reviews")
    public ResponseEntity<ReviewResponse> create(
            @PathVariable Long productId,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody @Valid CreateReviewRequest request) {
        Long userId = Long.parseLong(userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reviewService.create(productId, userId, request));
    }

    @DeleteMapping("/api/reviews/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long requesterId = Long.parseLong(userDetails.getUsername());
        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
        reviewService.delete(id, requesterId, isAdmin);
        return ResponseEntity.noContent().build();
    }
}
