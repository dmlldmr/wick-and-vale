package com.damla.wick_n_vale.product.web.dto;

import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class UpdateProductRequest {

    private String name;

    private String description;

    @Positive
    private BigDecimal price;

    @PositiveOrZero
    private Integer stock;

    private String imageUrl;

    private Long themeId;

    private Long variantId;
}
