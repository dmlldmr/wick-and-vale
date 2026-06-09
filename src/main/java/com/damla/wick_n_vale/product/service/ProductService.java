package com.damla.wick_n_vale.product.service;

import com.damla.wick_n_vale.product.enumaration.CollectionType;
import com.damla.wick_n_vale.product.enumaration.VariantType;
import com.damla.wick_n_vale.product.web.dto.CreateProductRequest;
import com.damla.wick_n_vale.product.web.dto.ProductResponse;
import com.damla.wick_n_vale.product.web.dto.UpdateProductRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductService {

    ProductResponse create(CreateProductRequest request);

    ProductResponse update(Long id, UpdateProductRequest request);

    ProductResponse getById(Long id);

    Page<ProductResponse> getAll(Pageable pageable);

    Page<ProductResponse> getByTheme(String themeType, Pageable pageable);

    Page<ProductResponse> getByCollection(CollectionType collectionType, Pageable pageable);

    Page<ProductResponse> getByThemeAndCollection(String themeType, CollectionType collectionType, Pageable pageable);

    Page<ProductResponse> getByVariant(VariantType variantType, Pageable pageable);

    Page<ProductResponse> search(String name, Pageable pageable);

    void delete(Long id);
}