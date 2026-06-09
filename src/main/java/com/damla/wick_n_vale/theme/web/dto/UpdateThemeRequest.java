package com.damla.wick_n_vale.theme.web.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateThemeRequest {

    private String themeType;

    private String description;

    private String coverImage;
}
