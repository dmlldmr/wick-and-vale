package com.damla.wick_n_vale.user.web.dto;

import com.damla.wick_n_vale.user.enumaration.RoleType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthResponse {
    private String token;
    private String refreshToken;
    private Long id;
    private String name;
    private String email;
    private RoleType role;
}
