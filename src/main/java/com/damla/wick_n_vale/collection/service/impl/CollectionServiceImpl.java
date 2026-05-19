package com.damla.wick_n_vale.collection.service.impl;

import com.damla.wick_n_vale.collection.entity.CollectionEntity;
import com.damla.wick_n_vale.collection.entity.CollectionVariantEntity;
import com.damla.wick_n_vale.collection.repository.CollectionRepository;
import com.damla.wick_n_vale.collection.repository.CollectionVariantRepository;
import com.damla.wick_n_vale.collection.service.CollectionService;
import com.damla.wick_n_vale.collection.web.dto.CollectionResponse;
import com.damla.wick_n_vale.collection.web.dto.CreateCollectionRequest;
import com.damla.wick_n_vale.collection.web.dto.UpdateCollectionRequest;
import com.damla.wick_n_vale.common.exception.InvalidOperationException;
import com.damla.wick_n_vale.common.exception.ResourceNotFoundException;
import com.damla.wick_n_vale.product.enumaration.CollectionType;
import com.damla.wick_n_vale.product.enumaration.VariantType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CollectionServiceImpl implements CollectionService {

    private final CollectionRepository collectionRepository;
    private final CollectionVariantRepository collectionVariantRepository;

    private static final Map<CollectionType, List<VariantType>> COLLECTION_VARIANTS = Map.of(
            CollectionType.BODUL, List.of(VariantType.SADE, VariantType.DESENLI),
            CollectionType.SUTUN, List.of(VariantType.INCE, VariantType.KALIN),
            CollectionType.KUTU,  List.of(VariantType.KAGIT, VariantType.TENEKE)
    );

    @Override
    @Transactional
    public CollectionResponse create(CreateCollectionRequest request) {
        if (collectionRepository.existsByCollectionType(request.getCollectionType())) {
            throw new InvalidOperationException("Collection already exists: " + request.getCollectionType());
        }

        CollectionEntity collection = new CollectionEntity();
        collection.setCollectionType(request.getCollectionType());
        collection.setDescription(request.getDescription());
        collection.setCoverImage(request.getCoverImage());
        CollectionEntity saved = collectionRepository.save(collection);

        for (VariantType variantType : COLLECTION_VARIANTS.get(request.getCollectionType())) {
            CollectionVariantEntity variant = new CollectionVariantEntity();
            variant.setVariantType(variantType);
            variant.setCollection(saved);
            collectionVariantRepository.save(variant);
        }

        return toResponse(collectionRepository.findById(saved.getId()).orElseThrow());
    }

    @Override
    @Transactional
    public CollectionResponse update(Long id, UpdateCollectionRequest request) {
        CollectionEntity collection = collectionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Collection not found: " + id));

        if (request.getCollectionType() != null) collection.setCollectionType(request.getCollectionType());
        if (request.getDescription() != null) collection.setDescription(request.getDescription());
        if (request.getCoverImage() != null) collection.setCoverImage(request.getCoverImage());

        return toResponse(collectionRepository.save(collection));
    }

    @Override
    @Transactional(readOnly = true)
    public CollectionResponse getById(Long id) {
        return toResponse(collectionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Collection not found: " + id)));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CollectionResponse> getAll() {
        return collectionRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!collectionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Collection not found: " + id);
        }
        collectionRepository.deleteById(id);
    }

    private CollectionResponse toResponse(CollectionEntity collection) {
        List<CollectionResponse.VariantInfo> variants = collection.getVariants().stream()
                .map(v -> CollectionResponse.VariantInfo.builder()
                        .id(v.getId())
                        .variantType(v.getVariantType())
                        .build())
                .toList();

        return CollectionResponse.builder()
                .id(collection.getId())
                .collectionType(collection.getCollectionType())
                .description(collection.getDescription())
                .coverImage(collection.getCoverImage())
                .variants(variants)
                .createdAt(collection.getCreatedAt())
                .build();
    }
}