package com.damla.wick_n_vale.order.repository;

import com.damla.wick_n_vale.order.entity.OrderItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemStatusRepository extends JpaRepository<OrderItemEntity, Long> {
}
