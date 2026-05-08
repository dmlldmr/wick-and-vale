package com.damla.wick_n_vale.collection.web.dto;

import com.damla.wick_n_vale.product.enumaration.CollectionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateCollectionRequest {

    @NotNull
    private CollectionType collectionType;

    private String description;

    private String coverImage;
}
