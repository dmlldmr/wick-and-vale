package com.damla.wick_n_vale.product.service.impl;

import com.damla.wick_n_vale.collection.entity.CollectionVariantEntity;
import com.damla.wick_n_vale.collection.repository.CollectionVariantRepository;
import com.damla.wick_n_vale.common.exception.ResourceNotFoundException;
import com.damla.wick_n_vale.order.repository.OrderItemStatusRepository;
import com.damla.wick_n_vale.product.entity.ProductEntity;
import com.damla.wick_n_vale.product.enumaration.CollectionType;
import com.damla.wick_n_vale.product.enumaration.VariantType;
import com.damla.wick_n_vale.product.repository.ProductRepository;
import com.damla.wick_n_vale.product.service.ProductService;
import com.damla.wick_n_vale.product.web.dto.CreateProductRequest;
import com.damla.wick_n_vale.product.web.dto.ProductResponse;
import com.damla.wick_n_vale.product.web.dto.UpdateProductRequest;
import com.damla.wick_n_vale.theme.entity.ThemeEntity;
import com.damla.wick_n_vale.theme.repository.ThemeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ThemeRepository themeRepository;
    private final CollectionVariantRepository collectionVariantRepository;
    private final OrderItemStatusRepository orderItemStatusRepository;

    @Override
    @Transactional
    public ProductResponse create(CreateProductRequest request) {
        ThemeEntity theme = themeRepository.findById(request.getThemeId())
                .orElseThrow(() -> new ResourceNotFoundException("Theme not found: " + request.getThemeId()));
        CollectionVariantEntity variant = collectionVariantRepository.findById(request.getVariantId())
                .orElseThrow(() -> new ResourceNotFoundException("Variant not found: " + request.getVariantId()));

        ProductEntity product = ProductEntity.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stock(request.getStock())
                .imageUrl(request.getImageUrl())  // 🔥 Değişiklik 1: getImage() -> getImageUrl()
                .theme(theme)
                .variant(variant)
                .build();

        return toResponse(productRepository.save(product));
    }

    @Override
    @Transactional
    public ProductResponse update(Long id, UpdateProductRequest request) {
        ProductEntity product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));

        if (request.getName() != null) product.setName(request.getName());
        if (request.getDescription() != null) product.setDescription(request.getDescription());
        if (request.getPrice() != null) product.setPrice(request.getPrice());
        if (request.getStock() != null) product.setStock(request.getStock());
        if (request.getImageUrl() != null) product.setImageUrl(request.getImageUrl());  // 🔥 Değişiklik 2: getImage() -> getImageUrl()

        if (request.getThemeId() != null) {
            ThemeEntity theme = themeRepository.findById(request.getThemeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Theme not found: " + request.getThemeId()));
            product.setTheme(theme);
        }

        if (request.getVariantId() != null) {
            CollectionVariantEntity variant = collectionVariantRepository.findById(request.getVariantId())
                    .orElseThrow(() -> new ResourceNotFoundException("Variant not found: " + request.getVariantId()));
            product.setVariant(variant);
        }

        return toResponse(productRepository.save(product));
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getById(Long id) {
        return toResponse(productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id)));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getAll(Pageable pageable) {
        return productRepository.findAll(pageable).map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getByTheme(String themeType, Pageable pageable) {
        return productRepository.findByTheme_ThemeType(themeType, pageable).map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getByCollection(CollectionType collectionType, Pageable pageable) {
        return productRepository.findByVariant_Collection_CollectionType(collectionType, pageable).map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getByThemeAndCollection(String themeType, CollectionType collectionType, Pageable pageable) {
        return productRepository.findByTheme_ThemeTypeAndVariant_Collection_CollectionType(themeType, collectionType, pageable).map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getByVariant(VariantType variantType, Pageable pageable) {
        return productRepository.findByVariant_VariantType(variantType, pageable).map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> search(String name, Pageable pageable) {
        return productRepository.findByNameContainingIgnoreCase(name, pageable).map(this::toResponse);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found: " + id);
        }
        productRepository.deleteById(id);
    }

    private ProductResponse toResponse(ProductEntity product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .imageUrl(product.getImageUrl())
                .themeId(product.getTheme() != null ? product.getTheme().getId() : null)
                .themeType(product.getTheme() != null ? product.getTheme().getThemeType() : null)
                .variantId(product.getVariant() != null ? product.getVariant().getId() : null)
                .variantType(product.getVariant() != null ? product.getVariant().getVariantType() : null)
                .collectionId(product.getVariant() != null ? product.getVariant().getCollection().getId() : null)
                .collectionType(product.getVariant() != null ? product.getVariant().getCollection().getCollectionType() : null)
                .createdAt(product.getCreatedAt())
                .hasOrders(orderItemStatusRepository.existsByProductId(product.getId()))
                .build();
    }
}