package com.damla.wick_n_vale.order.repository;

import com.damla.wick_n_vale.order.entity.OrderItemEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderItemStatusRepository extends JpaRepository<OrderItemEntity, Long> {
    @Query("SELECT oi.product.id, oi.product.name, oi.product.imageUrl, oi.product.price, SUM(oi.quantity) " +
    "FROM OrderItemEntity oi " +
    "GROUP BY oi.product.id, oi.product.name, oi.product.imageUrl, oi.product.price " +
    "ORDER BY SUM(oi.quantity) DESC")
    List<Object[]> findTopProducts(Pageable pageable);

    boolean existsByProductId(Long productId);
}
