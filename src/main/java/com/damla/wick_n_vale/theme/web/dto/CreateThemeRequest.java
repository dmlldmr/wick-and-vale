package com.damla.wick_n_vale.theme.web.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateThemeRequest {

    @NotBlank
    private String themeType;

    private String description;

    private String coverImage;
}