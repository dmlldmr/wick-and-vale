package com.damla.wick_n_vale.user.web.controller;

import com.damla.wick_n_vale.security.JwtService;
import com.damla.wick_n_vale.security.refreshToken.RefreshTokenRequest;
import com.damla.wick_n_vale.security.refreshToken.RefreshTokenResponse;
import com.damla.wick_n_vale.security.refreshToken.RefreshTokenService;
import com.damla.wick_n_vale.user.entity.UserEntity;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final RefreshTokenService refreshTokenService;
    private final JwtService jwtService;

    @PostMapping("/refresh")
    public ResponseEntity<RefreshTokenResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        UserEntity user = refreshTokenService.verifyAndRotate(request.getRefreshToken());
        String newAccessToken = jwtService.generateToken(user);
        String newRefreshToken = refreshTokenService.createRefreshToken(user);
        return ResponseEntity.ok(new RefreshTokenResponse(newAccessToken, newRefreshToken));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@Valid @RequestBody RefreshTokenRequest request) {
        refreshTokenService.revokeToken(request.getRefreshToken());
        return ResponseEntity.noContent().build();
    }
}
