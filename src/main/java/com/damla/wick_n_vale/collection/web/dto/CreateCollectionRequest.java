package com.damla.wick_n_vale.collection.web.dto;

import com.damla.wick_n_vale.product.enumaration.CollectionType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateCollectionRequest {
    @NotNull(message = "Koleksiyon tipi zorunludur")
    private CollectionType collectionType;

    private String description;

    private String coverImage;  // Backend tarafından set edilecek
}