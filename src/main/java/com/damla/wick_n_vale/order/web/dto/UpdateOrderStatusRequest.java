package com.damla.wick_n_vale.order.web.dto;

import com.damla.wick_n_vale.order.enumaration.OrderStatusType;
import com.damla.wick_n_vale.order.enumaration.PaymentStatusType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateOrderStatusRequest {

    private OrderStatusType orderStatus;

    private PaymentStatusType paymentStatus;

    private String cargoTrackNumber;
}
