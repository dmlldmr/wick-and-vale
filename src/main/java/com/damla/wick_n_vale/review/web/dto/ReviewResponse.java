package com.damla.wick_n_vale.review.web.dto;

import java.time.LocalDateTime;

public record ReviewResponse(
        Long id,
        Long userId,
        String userName,
        int rating,
        String comment,
        LocalDateTime createdAt
) {}
