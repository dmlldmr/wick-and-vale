package com.damla.wick_n_vale.collection.entity;

import com.damla.wick_n_vale.common.BaseEntity;
import com.damla.wick_n_vale.product.entity.ProductEntity;
import com.damla.wick_n_vale.product.enumaration.VariantType;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "collection_variants",
        uniqueConstraints = @UniqueConstraint(columnNames = {"variant_type", "collection_id"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CollectionVariantEntity extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "variant_type", nullable = false)
    private VariantType variantType;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "collection_id", nullable = false)
    private CollectionEntity collection;

    @OneToMany(
            mappedBy = "variant",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<ProductEntity> products = new ArrayList<>();
}
