package com.damla.wick_n_vale.order.service;

import com.damla.wick_n_vale.order.enumaration.OrderStatusType;
import com.damla.wick_n_vale.order.web.dto.CreateOrderRequest;
import com.damla.wick_n_vale.order.web.dto.OrderResponse;
import com.damla.wick_n_vale.order.web.dto.UpdateOrderStatusRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface OrderService {

    OrderResponse create(CreateOrderRequest request);

    OrderResponse updateStatus(Long id, UpdateOrderStatusRequest request);

    OrderResponse getById(Long id, Long requestId, boolean isAdmin);

    Page<OrderResponse> getAll(Pageable pageable);

    Page<OrderResponse> getByUserId(Long userId, Pageable pageable);

    Page<OrderResponse> getByStatus(OrderStatusType status, Pageable pageable);

    void cancel(Long id, Long userId);
}
