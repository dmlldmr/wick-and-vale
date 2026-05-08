package com.damla.wick_n_vale.collection.entity;

import com.damla.wick_n_vale.common.BaseEntity;
import com.damla.wick_n_vale.product.enumaration.CollectionType;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "collections")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CollectionEntity extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
   private CollectionType collectionType;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String coverImage;

    @OneToMany(
            mappedBy = "collection",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<CollectionVariantEntity> variants = new ArrayList<>();

}
