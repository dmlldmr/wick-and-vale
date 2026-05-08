package com.damla.wick_n_vale.theme.web.dto;

import com.damla.wick_n_vale.theme.enumaration.ThemeType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ThemeResponse {
    private Long id;
    private ThemeType themeType;
    private String description;
    private String coverImage;
    private LocalDateTime createdAt;
}
