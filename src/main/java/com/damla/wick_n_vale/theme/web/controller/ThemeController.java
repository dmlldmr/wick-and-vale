package com.damla.wick_n_vale.theme.web.controller;

import com.damla.wick_n_vale.theme.service.ThemeService;
import com.damla.wick_n_vale.theme.web.dto.CreateThemeRequest;
import com.damla.wick_n_vale.theme.web.dto.ThemeResponse;
import com.damla.wick_n_vale.theme.web.dto.UpdateThemeRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/themes")
@RequiredArgsConstructor
public class ThemeController {

    private final ThemeService themeService;

    @PostMapping
    public ResponseEntity<ThemeResponse> create(@Valid @RequestBody CreateThemeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(themeService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ThemeResponse> update(
            @PathVariable Long id, @Valid @RequestBody UpdateThemeRequest request) {
        return ResponseEntity.ok(themeService.update(id, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ThemeResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(themeService.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<ThemeResponse>> getAll() {
        return ResponseEntity.ok(themeService.getAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        themeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}