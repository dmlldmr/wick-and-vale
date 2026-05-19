package com.damla.wick_n_vale.collection.web.dto;

import com.damla.wick_n_vale.product.enumaration.CollectionType;
import lombok.Data;

@Data
public class UpdateCollectionRequest {
    private CollectionType collectionType;
    private String description;
    private String coverImage;  // Backend tarafından set edilecek
}