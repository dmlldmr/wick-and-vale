package com.damla.wick_n_vale.theme.entity;

import com.damla.wick_n_vale.common.BaseEntity;
import com.damla.wick_n_vale.theme.enumaration.ThemeType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "themes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ThemeEntity extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private ThemeType themeType;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String coverImage;

}
