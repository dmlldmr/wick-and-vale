package com.damla.wick_n_vale.user.service;

import com.damla.wick_n_vale.user.web.dto.AuthResponse;
import com.damla.wick_n_vale.user.web.dto.LoginRequest;
import com.damla.wick_n_vale.user.web.dto.RegisterRequest;
import com.damla.wick_n_vale.user.web.dto.UserResponse;

import java.util.List;

public interface UserService {

    UserResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    UserResponse getById(Long id);

    List<UserResponse> getAll();

    void delete(Long id);
}
