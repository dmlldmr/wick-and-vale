package com.damla.wick_n_vale.product.repository;

import com.damla.wick_n_vale.product.entity.ProductEntity;
import com.damla.wick_n_vale.product.enumaration.CollectionType;
import com.damla.wick_n_vale.product.enumaration.VariantType;
import com.damla.wick_n_vale.theme.enumaration.ThemeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductRepository extends JpaRepository<ProductEntity, Long> {

    Page<ProductEntity> findByTheme_ThemeType(ThemeType themeType, Pageable pageable);

    Page<ProductEntity> findByVariant_Collection_CollectionType(CollectionType collectionType, Pageable pageable);

    Page<ProductEntity> findByTheme_ThemeTypeAndVariant_Collection_CollectionType(ThemeType themeType, CollectionType collectionType, Pageable pageable);

    Page<ProductEntity> findByVariant_VariantType(VariantType variantType, Pageable pageable);

    Page<ProductEntity> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
