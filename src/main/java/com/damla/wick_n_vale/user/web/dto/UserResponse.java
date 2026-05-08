package com.damla.wick_n_vale.user.web.dto;

import com.damla.wick_n_vale.user.enumaration.RoleType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Builder
public class UserResponse {

    private Long id;

    private String name;

    private String email;

    private RoleType role;

    private LocalDateTime createdAt;
}
