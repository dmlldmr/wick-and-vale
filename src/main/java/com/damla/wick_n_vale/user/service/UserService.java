package com.damla.wick_n_vale.user.service;

import com.damla.wick_n_vale.user.entity.UserEntity;
import com.damla.wick_n_vale.user.web.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {

    UserResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    UserResponse getById(Long id);

    Page<UserResponse> getAll(Pageable pageable);

    void delete(Long id);

    UserResponse updateProfile(Long id, UpdateProfileRequest request);

    void changePassword(Long id, ChangePasswordRequest request);
}
