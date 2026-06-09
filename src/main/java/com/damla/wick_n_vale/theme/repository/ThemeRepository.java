package com.damla.wick_n_vale.theme.repository;

import com.damla.wick_n_vale.theme.entity.ThemeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ThemeRepository extends JpaRepository<ThemeEntity, Long> {
    boolean existsByThemeType(String themeType);
    Optional<ThemeEntity> findByThemeType(String themeType);
}