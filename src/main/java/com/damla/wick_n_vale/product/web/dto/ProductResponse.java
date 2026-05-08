package com.damla.wick_n_vale.product.web.dto;

import com.damla.wick_n_vale.product.enumaration.CollectionType;
import com.damla.wick_n_vale.product.enumaration.VariantType;
import com.damla.wick_n_vale.theme.enumaration.ThemeType;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class ProductResponse {

    private Long id;

    private String name;

    private String description;

    private BigDecimal price;

    private Integer stock;

    private String imageUrl;

    private Long themeId;

    private ThemeType themeType;

    private Long variantId;

    private VariantType variantType;

    private Long collectionId;

    private CollectionType collectionType;

    private LocalDateTime createdAt;
}
