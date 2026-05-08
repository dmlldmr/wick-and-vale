package com.damla.wick_n_vale.theme.service;

import com.damla.wick_n_vale.theme.web.dto.CreateThemeRequest;
import com.damla.wick_n_vale.theme.web.dto.ThemeResponse;
import com.damla.wick_n_vale.theme.web.dto.UpdateThemeRequest;

import java.util.List;

public interface ThemeService {
    ThemeResponse create(CreateThemeRequest request);
    ThemeResponse update(Long id, UpdateThemeRequest request);
    ThemeResponse getById(Long id);
    List<ThemeResponse> getAll();
    void delete(Long id);
}
