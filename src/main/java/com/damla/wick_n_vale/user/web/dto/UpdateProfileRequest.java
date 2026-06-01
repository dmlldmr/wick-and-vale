package com.damla.wick_n_vale.user.web.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    @NotBlank(message = "İsim boş olamaz")
    private String name;

    @NotBlank(message = "E-posta boş olamaz")
    @Email(message = "Geçerli bbir e-posta adresi giriniz")
    private String email;

}
