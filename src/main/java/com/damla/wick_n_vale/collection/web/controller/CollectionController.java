package com.damla.wick_n_vale.collection.web.controller;

import com.damla.wick_n_vale.collection.service.CollectionService;
import com.damla.wick_n_vale.collection.web.dto.CollectionResponse;
import com.damla.wick_n_vale.collection.web.dto.CreateCollectionRequest;
import com.damla.wick_n_vale.collection.web.dto.UpdateCollectionRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/collections")
@RequiredArgsConstructor
public class CollectionController {

    private final CollectionService collectionService;

    @PostMapping
    public ResponseEntity<CollectionResponse> create(@Valid @RequestBody CreateCollectionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(collectionService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CollectionResponse> update(
            @PathVariable Long id, @Valid @RequestBody UpdateCollectionRequest request) {
        return ResponseEntity.ok(collectionService.update(id, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CollectionResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(collectionService.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<CollectionResponse>> getAll() {
        return ResponseEntity.ok(collectionService.getAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<CollectionResponse> delete(@PathVariable Long id) {
        collectionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
