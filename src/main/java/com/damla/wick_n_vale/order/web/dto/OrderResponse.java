package com.damla.wick_n_vale.order.web.dto;

import com.damla.wick_n_vale.order.enumaration.OrderStatusType;
import com.damla.wick_n_vale.order.enumaration.PaymentStatusType;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class OrderResponse {

    private Long id;

    private Long userId;

    private String customerName;

    private String customerEmail;

    private String address;

    private BigDecimal totalPrice;

    private OrderStatusType orderStatus;

    private PaymentStatusType paymentStatus;

    private String cargoTrackNumber;

    private List<OrderItemResponse> items;

    private LocalDateTime createdAt;
}
