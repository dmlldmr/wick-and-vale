package com.damla.wick_n_vale.order.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CreateOrderRequest {

    private Long userId;

    private String guestName;

    private String guestEmail;

    @NotBlank
    private String address;

    @NotEmpty
    private List<OrderItemRequest> items;
}
