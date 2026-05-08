package com.damla.wick_n_vale.product.web.controller;

import com.damla.wick_n_vale.product.enumaration.CollectionType;
import com.damla.wick_n_vale.product.enumaration.VariantType;
import com.damla.wick_n_vale.product.service.ProductService;
import com.damla.wick_n_vale.product.web.dto.CreateProductRequest;
import com.damla.wick_n_vale.product.web.dto.ProductResponse;
import com.damla.wick_n_vale.product.web.dto.UpdateProductRequest;
import com.damla.wick_n_vale.theme.enumaration.ThemeType;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public ResponseEntity<ProductResponse> create(@Valid @RequestBody CreateProductRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> update(
            @PathVariable Long id, @Valid @RequestBody UpdateProductRequest request) {
        return ResponseEntity.ok(productService.update(id, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getById(id));
    }

    @GetMapping
    public ResponseEntity<Page<ProductResponse>> getAll(Pageable pageable) {
        return ResponseEntity.ok(productService.getAll(pageable));
    }

    @GetMapping("/theme/{themeType}")
    public ResponseEntity<Page<ProductResponse>> getByTheme(
            @PathVariable ThemeType themeType, Pageable pageable) {
        return ResponseEntity.ok(productService.getByTheme(themeType, pageable));
    }

    @GetMapping("/collection/{collectionType}")
    public ResponseEntity<Page<ProductResponse>> getByCollection(
            @PathVariable CollectionType collectionType, Pageable pageable) {
        return ResponseEntity.ok(productService.getByCollection(collectionType, pageable));
    }

    @GetMapping("/theme/{themeType}/collection/{collectionType}")
    public ResponseEntity<Page<ProductResponse>> getByThemeAndCollection(
            @PathVariable ThemeType themeType,
            @PathVariable CollectionType collectionType,
            Pageable pageable) {
        return ResponseEntity.ok(productService.getByThemeAndCollection(themeType, collectionType, pageable));
    }

    @GetMapping("/variant/{variantType}")
    public ResponseEntity<Page<ProductResponse>> getByVariant(
            @PathVariable VariantType variantType, Pageable pageable) {
        return ResponseEntity.ok(productService.getByVariant(variantType, pageable));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ProductResponse>> search(@RequestParam String name, Pageable pageable) {
        return ResponseEntity.ok(productService.search(name, pageable));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }
}