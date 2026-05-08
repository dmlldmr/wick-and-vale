package com.damla.wick_n_vale.theme.web.dto;

import com.damla.wick_n_vale.theme.enumaration.ThemeType;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateThemeRequest {

    @NotNull
    private ThemeType themeType;

    private String description;

    private String coverImage;

}
