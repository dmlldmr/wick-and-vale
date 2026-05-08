package com.damla.wick_n_vale.order.web.controller;

import com.damla.wick_n_vale.order.enumaration.OrderStatusType;
import com.damla.wick_n_vale.order.service.OrderService;
import com.damla.wick_n_vale.order.web.dto.CreateOrderRequest;
import com.damla.wick_n_vale.order.web.dto.OrderResponse;
import com.damla.wick_n_vale.order.web.dto.UpdateOrderStatusRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> create(@Valid @RequestBody CreateOrderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.create(request));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderResponse> updateStatus(@PathVariable Long id,
                                                      @Valid @RequestBody UpdateOrderStatusRequest request) {
        return ResponseEntity.ok(orderService.updateStatus(id, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getById(id));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<OrderResponse>> getAll(Pageable pageable) {
        return ResponseEntity.ok(orderService.getAll(pageable));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<OrderResponse>> getByUser(@PathVariable Long userId, Pageable pageable) {
        return ResponseEntity.ok(orderService.getByUserId(userId, pageable));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<OrderResponse>> getByStatus(@PathVariable OrderStatusType status, Pageable pageable) {
        return ResponseEntity.ok(orderService.getByStatus(status, pageable));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Void> cancel(@PathVariable Long id) {
        orderService.cancel(id);
        return ResponseEntity.noContent().build();
    }
}
