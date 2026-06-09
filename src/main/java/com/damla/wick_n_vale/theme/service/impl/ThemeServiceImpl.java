package com.damla.wick_n_vale.theme.service.impl;

import com.damla.wick_n_vale.common.exception.InvalidOperationException;
import com.damla.wick_n_vale.common.exception.ResourceNotFoundException;
import com.damla.wick_n_vale.theme.entity.ThemeEntity;
import com.damla.wick_n_vale.theme.repository.ThemeRepository;
import com.damla.wick_n_vale.theme.service.ThemeService;
import com.damla.wick_n_vale.theme.web.dto.CreateThemeRequest;
import com.damla.wick_n_vale.theme.web.dto.ThemeResponse;
import com.damla.wick_n_vale.theme.web.dto.UpdateThemeRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ThemeServiceImpl implements ThemeService {

    private final ThemeRepository themeRepository;

    @Override
    @Transactional
    public ThemeResponse create(CreateThemeRequest request) {
        if(themeRepository.existsByThemeType(request.getThemeType())) {
            throw new InvalidOperationException("There is already a theme with this type: " + request.getThemeType());
        }

        ThemeEntity themeEntity = new ThemeEntity();
        themeEntity.setThemeType(request.getThemeType());
        themeEntity.setDescription(request.getDescription());
        themeEntity.setCoverImage(request.getCoverImage());

        return toResponse(themeRepository.save(themeEntity));
    }

    @Override
    @Transactional
    public ThemeResponse update(Long id, UpdateThemeRequest request) {
        ThemeEntity themeEntity = themeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("There is no theme with this id: " + id));

        if(request.getThemeType() != null && !request.getThemeType().equals(themeEntity.getThemeType())) {
            if(themeRepository.existsByThemeType(request.getThemeType())) {
                throw new InvalidOperationException("There is already a theme with this type: " + request.getThemeType());
            }
            themeEntity.setThemeType(request.getThemeType());
        }
        if(request.getDescription() != null) themeEntity.setDescription(request.getDescription());
        if(request.getCoverImage() != null) themeEntity.setCoverImage(request.getCoverImage());
        return toResponse(themeRepository.save(themeEntity));
    }

    @Override
    public ThemeResponse getById(Long id) {
        return toResponse(themeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Theme not found: " +id)));
    }

    @Override
    public List<ThemeResponse> getAll() {
        return themeRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if(!themeRepository.existsById(id)) {
            throw new ResourceNotFoundException("There is no theme with this id: " + id);
        }
        themeRepository.deleteById(id);
    }

    private ThemeResponse toResponse(ThemeEntity themeEntity) {
        return ThemeResponse.builder()
                .id(themeEntity.getId())
                .themeType(themeEntity.getThemeType())
                .description(themeEntity.getDescription())
                .coverImage(themeEntity.getCoverImage())
                .createdAt(themeEntity.getCreatedAt())
                .build();
    }
}
