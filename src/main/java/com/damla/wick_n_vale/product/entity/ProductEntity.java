package com.damla.wick_n_vale.product.entity;

import com.damla.wick_n_vale.common.BaseEntity;
import com.damla.wick_n_vale.theme.entity.ThemeEntity;
import com.damla.wick_n_vale.collection.entity.CollectionVariantEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(
        name = "products",
        indexes = {
                @Index(name = "idx_product_name", columnList = "name"),
                @Index(name = "idx_product_theme", columnList = "theme_id"),
                @Index(name = "idx_product_variant", columnList = "variant_id")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductEntity extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer stock;

    private String imageUrl;

    @ManyToOne(fetch =  FetchType.LAZY)
    @JoinColumn(name = "theme_id")
    private ThemeEntity theme;

    @ManyToOne(fetch =  FetchType.LAZY)
    @JoinColumn(name = "variant_id")
    private CollectionVariantEntity variant;
}
