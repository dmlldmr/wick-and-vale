package com.damla.wick_n_vale.security.refreshToken;

import com.damla.wick_n_vale.common.exception.InvalidOperationException;
import com.damla.wick_n_vale.user.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${jwt.refresh-expiration}")
    private long refreshExpiration;

    @Transactional
    public String createRefreshToken(UserEntity user) {
        RefreshTokenEntity refreshToken = new RefreshTokenEntity();
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setUser(user);
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshExpiration));
        refreshToken.setRevoked(false);
        return refreshTokenRepository.save(refreshToken).getToken();
    }

    @Transactional
    public UserEntity verifyAndRotate(String token) {
        RefreshTokenEntity refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new InvalidOperationException("Invalid refresh token"));

        if(refreshToken.isRevoked()) {
            throw new InvalidOperationException("Refresh token has been revoked");
        }

        if(refreshToken.getExpiryDate().isBefore(Instant.now())) {
            refreshToken.setRevoked(true);
            refreshTokenRepository.save(refreshToken);
            throw new InvalidOperationException("Refresh token has expired, please login again");
        }

        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);

        return refreshToken.getUser();
    }

    @Transactional
    public void revokeToken(String token) {
        refreshTokenRepository.findByToken(token).ifPresent(t -> {
            refreshTokenRepository.delete(t);
        });
    }
}
