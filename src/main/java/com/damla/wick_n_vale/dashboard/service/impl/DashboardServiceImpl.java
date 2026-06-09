package com.damla.wick_n_vale.dashboard.service.impl;

import com.damla.wick_n_vale.dashboard.service.DashboardService;
import com.damla.wick_n_vale.dashboard.web.dto.DashboardResponse;
import com.damla.wick_n_vale.dashboard.web.dto.TopProductResponse;
import com.damla.wick_n_vale.order.enumaration.OrderStatusType;
import com.damla.wick_n_vale.order.repository.OrderItemStatusRepository;
import com.damla.wick_n_vale.order.repository.OrderRepository;
import com.damla.wick_n_vale.product.repository.ProductRepository;
import com.damla.wick_n_vale.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {
    private final OrderRepository orderRepository;
    private final OrderItemStatusRepository orderItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Override
    public DashboardResponse getDashboard() {
        BigDecimal totalRevenue = orderRepository.getTotalRevenue();
        if(totalRevenue == null) totalRevenue = BigDecimal.ZERO;

        Map<OrderStatusType, Long> statusCounts = orderRepository.countByStatus()
                .stream()
                .collect(Collectors.toMap(
                        row -> (OrderStatusType) row[0],
                        row -> (Long) row[1]
                ));
        List<TopProductResponse> topProducts = orderItemRepository
                .findTopProducts(PageRequest.of(0, 5))
                .stream()
                .map(row -> new TopProductResponse(
                        (Long) row[0],
                        (String) row[1],
                        (String) row[2],
                        (BigDecimal) row[3],
                        (Long) row[4]
                ))
                .toList();

        return new DashboardResponse(
                totalRevenue,
                orderRepository.count(),
                statusCounts.getOrDefault(OrderStatusType.PENDING, 0L),
                statusCounts.getOrDefault(OrderStatusType.PROCESSING, 0L),
                statusCounts.getOrDefault(OrderStatusType.SHIPPED, 0L),
                statusCounts.getOrDefault(OrderStatusType.DELIVERED, 0L),
                statusCounts.getOrDefault(OrderStatusType.CANCELLED, 0L),
                userRepository.count(),
                productRepository.count(),
                topProducts
        );
    }
}
