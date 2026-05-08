package com.damla.wick_n_vale.order.service.impl;

import com.damla.wick_n_vale.common.exception.InsufficientStockException;
import com.damla.wick_n_vale.common.exception.InvalidOperationException;
import com.damla.wick_n_vale.common.exception.ResourceNotFoundException;
import com.damla.wick_n_vale.order.entity.OrderEntity;
import com.damla.wick_n_vale.order.entity.OrderItemEntity;
import com.damla.wick_n_vale.order.enumaration.OrderStatusType;
import com.damla.wick_n_vale.order.enumaration.PaymentStatusType;
import com.damla.wick_n_vale.order.repository.OrderRepository;
import com.damla.wick_n_vale.order.service.OrderService;
import com.damla.wick_n_vale.order.web.dto.*;
import com.damla.wick_n_vale.product.entity.ProductEntity;
import com.damla.wick_n_vale.product.repository.ProductRepository;
import com.damla.wick_n_vale.user.entity.UserEntity;
import com.damla.wick_n_vale.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public OrderResponse create(CreateOrderRequest request) {
        OrderEntity order = new OrderEntity();
        order.setAddress(request.getAddress());
        order.setStatus(OrderStatusType.PENDING);
        order.setPaymentStatus(PaymentStatusType.PENDING);

        if(request.getUserId() != null) {
            UserEntity user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found: " + request.getUserId()));
            order.setUser(user);
        } else {
            order.setGuestName(request.getGuestName());
            order.setGuestEmail(request.getGuestEmail());
        }

        List<OrderItemEntity> items = new ArrayList<>();
        BigDecimal totalPrice = BigDecimal.ZERO;

        for(OrderItemRequest itemRequest : request.getItems()) {
            ProductEntity product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + itemRequest.getProductId()));

            if(product.getStock() < itemRequest.getQuantity()) {
                throw new InsufficientStockException("Not enough stock: " + product.getName());
            }

            product.setStock(product.getStock() - itemRequest.getQuantity());
            productRepository.save(product);

            OrderItemEntity item = new OrderItemEntity();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemRequest.getQuantity());
            item.setPrice(product.getPrice());

            items.add(item);
            totalPrice = totalPrice.add(product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity())));
        }

        order.setTotalPrice(totalPrice);
        order.setOrderItems(items);

        OrderEntity saved = orderRepository.save(order);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public OrderResponse updateStatus(Long id, UpdateOrderStatusRequest request) {
        OrderEntity order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + id));

        if(request.getOrderStatus() != null) order.setStatus(request.getOrderStatus());
        if(request.getPaymentStatus() != null) order.setPaymentStatus(request.getPaymentStatus());
        if(request.getCargoTrackNumber() != null) order.setCargoTrackNumber(request.getCargoTrackNumber());

        OrderEntity saved = orderRepository.save(order);
        return toResponse(saved);
    }

    @Override
    public OrderResponse getById(Long id) {
        OrderEntity order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + id));
        return toResponse(order);
    }

    @Override
    public Page<OrderResponse> getAll(Pageable pageable) {
        return orderRepository.findAll(pageable).map(this::toResponse);
    }

    @Override
    public Page<OrderResponse> getByUserId(Long userId, Pageable pageable) {
        return orderRepository.findByUserId(userId, pageable).map(this::toResponse);
    }

    @Override
    public Page<OrderResponse> getByStatus(OrderStatusType status, Pageable pageable) {
        return orderRepository.findByStatus(status, pageable).map(this::toResponse);
    }

    @Override
    @Transactional
    public void cancel(Long id) {
        OrderEntity order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + id));

        if(order.getStatus() == OrderStatusType.SHIPPED || order.getStatus() == OrderStatusType.DELIVERED) {
            throw new InvalidOperationException("Order is already shipped/delivered. Order can't be cancelled");
        }

        for(OrderItemEntity item : order.getOrderItems()) {
            ProductEntity product = item.getProduct();
            product.setStock(product.getStock() + item.getQuantity());
            productRepository.save(product);
        }

        order.setStatus(OrderStatusType.CANCELLED);
        orderRepository.save(order);
    }

    private OrderResponse toResponse(OrderEntity order) {
        String customerName = order.getUser() != null ? order.getUser().getName() : order.getGuestName();
        String customerEmail = order.getUser() != null ? order.getUser().getEmail() : order.getGuestEmail();

        List<OrderItemResponse> itemResponses = order.getOrderItems() == null ? List.of() :
                order.getOrderItems().stream().map(item -> OrderItemResponse.builder()
                        .id(item.getId())
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getName())
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .subtotal(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                        .build()
                ).toList();

        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUser() != null ? order.getUser().getId() : null)
                .customerName(customerName)
                .customerEmail(customerEmail)
                .address(order.getAddress())
                .totalPrice(order.getTotalPrice())
                .orderStatus(order.getStatus())
                .paymentStatus(order.getPaymentStatus())
                .cargoTrackNumber(order.getCargoTrackNumber())
                .items(itemResponses)
                .createdAt(order.getCreatedAt())
                .build();
    }
}
