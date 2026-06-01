package com.damla.wick_n_vale.cart.web.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddToCartRequest {

    @NotNull
    private Long productId;

    @Min(1)
    private int quantity = 1;
}
