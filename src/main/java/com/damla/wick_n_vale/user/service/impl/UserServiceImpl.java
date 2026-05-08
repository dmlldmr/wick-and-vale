package com.damla.wick_n_vale.user.service.impl;

import com.damla.wick_n_vale.common.exception.EmailAlreadyExistException;
import com.damla.wick_n_vale.common.exception.InvalidCredentialException;
import com.damla.wick_n_vale.common.exception.ResourceNotFoundException;
import com.damla.wick_n_vale.order.repository.OrderRepository;
import com.damla.wick_n_vale.security.JwtService;
import com.damla.wick_n_vale.user.entity.UserEntity;
import com.damla.wick_n_vale.user.enumaration.RoleType;
import com.damla.wick_n_vale.user.repository.UserRepository;
import com.damla.wick_n_vale.user.service.UserService;
import com.damla.wick_n_vale.user.web.dto.AuthResponse;
import com.damla.wick_n_vale.user.web.dto.LoginRequest;
import com.damla.wick_n_vale.user.web.dto.RegisterRequest;
import com.damla.wick_n_vale.user.web.dto.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final OrderRepository orderRepository;


    @Override
    @Transactional
    public UserResponse register(RegisterRequest request) {

        if(userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistException("Email address already in use");
        }

        UserEntity user = new UserEntity();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(RoleType.USER);

        UserEntity saved = userRepository.save(user);
        return toResponse(saved);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + request.getEmail()));

        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialException("Incorrect password");
        }

        AuthResponse response = new AuthResponse();
        response.setToken(jwtService.generateToken(user));
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        return response;
    }

    @Override
    public UserResponse getById(Long id) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: "));

        return toResponse(user);
    }

    @Override
    public List<UserResponse> getAll() {
        return userRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if(!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found: ");
        }
        orderRepository.nullifyUserForOrders(id);
        userRepository.deleteById(id);
    }

    private UserResponse toResponse(UserEntity user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
