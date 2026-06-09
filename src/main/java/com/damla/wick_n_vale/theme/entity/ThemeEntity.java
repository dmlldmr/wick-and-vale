package com.damla.wick_n_vale.theme.entity;

import com.damla.wick_n_vale.common.BaseEntity;
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

    @Column(nullable = false, unique = true)
    private String themeType;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String coverImage;

}
