package com.damla.wick_n_vale.collection.web.dto;

import com.damla.wick_n_vale.product.enumaration.CollectionType;
import com.damla.wick_n_vale.product.enumaration.VariantType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class CollectionResponse {
    private Long id;

    private CollectionType collectionType;

    private String description;

    private String coverImage;

    private List<VariantInfo> variants;

    private LocalDateTime createdAt;

    @Getter
    @Builder
    public static class VariantInfo {
        private Long id;
        private VariantType variantType;
    }
}
