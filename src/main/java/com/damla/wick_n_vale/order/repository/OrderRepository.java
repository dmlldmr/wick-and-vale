package com.damla.wick_n_vale.order.repository;

import com.damla.wick_n_vale.order.entity.OrderEntity;
import com.damla.wick_n_vale.order.enumaration.OrderStatusType;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderRepository extends JpaRepository<OrderEntity, Long> {

    Page<OrderEntity> findByUserId(Long userId, Pageable pageable);

    Page<OrderEntity> findByStatus(OrderStatusType status, Pageable pageable);

    @Modifying
    @Query("UPDATE OrderEntity o SET o.user = null WHERE o.user.id = :userId")
    void nullifyUserForOrders(@Param("userId") Long userId);
}
