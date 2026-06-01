package com.damla.wick_n_vale.security.refreshToken;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RefreshTokenRequest {

    @NotBlank(message = "Refresh Token boş olamaz")
    private String refreshToken;
}
