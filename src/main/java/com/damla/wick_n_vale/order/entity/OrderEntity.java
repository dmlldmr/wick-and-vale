package com.damla.wick_n_vale.order.entity;

import com.damla.wick_n_vale.common.BaseEntity;
import com.damla.wick_n_vale.order.enumaration.OrderStatusType;
import com.damla.wick_n_vale.order.enumaration.PaymentStatusType;
import com.damla.wick_n_vale.user.entity.UserEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "orders",
        indexes = {
                @Index(name = "idx_order_user", columnList = "user_id"),
                @Index(name = "idx_order_status", columnList = "status")
        }
        )
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    private String guestName;

    private String guestEmail;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal totalPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatusType status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatusType paymentStatus;

    private String cargoTrackNumber;

    @OneToMany(
            mappedBy = "order",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<OrderItemEntity> orderItems = new ArrayList<>();
}
