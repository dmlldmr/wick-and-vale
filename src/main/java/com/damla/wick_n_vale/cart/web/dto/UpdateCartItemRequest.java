package com.damla.wick_n_vale.cart.web.dto;

import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateCartItemRequest {

    @Min(0)
    private int quantity;
}
