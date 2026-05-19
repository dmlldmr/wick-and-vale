package com.damla.wick_n_vale.product.web.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateProductRequest {
    @NotNull(message = "Ürün adı zorunludur")
    private String name;

    private String description;

    @NotNull(message = "Fiyat zorunludur")
    private BigDecimal price;

    @NotNull(message = "Stok zorunludur")
    private Integer stock;

    @NotNull(message = "Tema seçimi zorunludur")
    private Long themeId;

    @NotNull(message = "Varyant seçimi zorunludur")
    private Long variantId;

    private String imageUrl;  // Backend tarafından set edilecek
}