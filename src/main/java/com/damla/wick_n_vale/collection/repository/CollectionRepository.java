package com.damla.wick_n_vale.collection.repository;

import com.damla.wick_n_vale.collection.entity.CollectionEntity;
import com.damla.wick_n_vale.product.enumaration.CollectionType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CollectionRepository extends JpaRepository<CollectionEntity, Long> {

    Optional<CollectionEntity> findByCollectionType(CollectionType collectionType);

    boolean existsByCollectionType(CollectionType collectionType);
}
