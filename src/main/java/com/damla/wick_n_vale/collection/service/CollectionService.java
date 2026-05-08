package com.damla.wick_n_vale.collection.service;

import com.damla.wick_n_vale.collection.web.dto.CollectionResponse;
import com.damla.wick_n_vale.collection.web.dto.CreateCollectionRequest;
import com.damla.wick_n_vale.collection.web.dto.UpdateCollectionRequest;

import java.util.List;

public interface CollectionService {

    CollectionResponse create(CreateCollectionRequest request);

    CollectionResponse update(Long id, UpdateCollectionRequest request);

    CollectionResponse getById(Long id);

    List<CollectionResponse> getAll();

    void delete(Long id);
}
