package com.damla.wick_n_vale.user.web.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChangePasswordRequest {

    @NotBlank(message = "Mevcut şifre boş olamaz")
    private String currentPassword;

    @NotBlank(message = "Yeni şifre boş olamaz")
    private String newPassword;
}
