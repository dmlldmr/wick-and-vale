package com.damla.wick_n_vale.collection.web.controller;

import com.damla.wick_n_vale.collection.service.CollectionService;
import com.damla.wick_n_vale.collection.web.dto.CollectionResponse;
import com.damla.wick_n_vale.collection.web.dto.CreateCollectionRequest;
import com.damla.wick_n_vale.collection.web.dto.UpdateCollectionRequest;
import com.damla.wick_n_vale.common.service.FileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/collections")
@RequiredArgsConstructor
public class CollectionController {

    private final CollectionService collectionService;
    private final FileService fileService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CollectionResponse> create(
            @RequestPart("data") @Valid CreateCollectionRequest request,
            @RequestPart(value = "file", required = false) MultipartFile file) {

        // Dosyayı kaydet ve URL al
        String imageUrl = fileService.saveFile(file, "collections");
        request.setCoverImage(imageUrl);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(collectionService.create(request));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CollectionResponse> update(
            @PathVariable Long id,
            @RequestPart("data") @Valid UpdateCollectionRequest request,
            @RequestPart(value = "file", required = false) MultipartFile file) {

        // Yeni dosya varsa kaydet, eskiyi sil
        if (file != null && !file.isEmpty()) {
            // Eski resmi bul
            CollectionResponse existing = collectionService.getById(id);
            if (existing.getCoverImage() != null) {
                fileService.deleteFile(existing.getCoverImage());
            }

            String imageUrl = fileService.saveFile(file, "collections");
            request.setCoverImage(imageUrl);
        }

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
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        // Önce resmi sil
        CollectionResponse existing = collectionService.getById(id);
        if (existing.getCoverImage() != null) {
            fileService.deleteFile(existing.getCoverImage());
        }
        collectionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}