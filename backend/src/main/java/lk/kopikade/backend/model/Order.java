package lk.kopikade.backend.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "user")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password"})
    private User user;

    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;

    @Column(name = "discount_amount")
    private Double discountAmount = 0.0;

    @Column(name = "payable_amount", nullable = false)
    private Double payableAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.PENDING;

    @Column(name = "payment_method")
    private String paymentMethod; // e.g. "CARD", "CASH", "LOYALTY_POINTS"

    @Column(name = "payment_status")
    private String paymentStatus = "PENDING"; // e.g. "PENDING", "PAID", "REFUNDED"

    @Column(name = "delivery_address", nullable = false)
    private String deliveryAddress;

    private String phone;

    @Column(name = "order_date")
    private LocalDateTime orderDate;

    @Column(name = "tracking_number", unique = true)
    private String trackingNumber;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonIgnoreProperties("order")
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        orderDate = LocalDateTime.now();
        if (discountAmount == null) {
            discountAmount = 0.0;
        }
        if (payableAmount == null) {
            payableAmount = totalAmount - discountAmount;
        }
        if (trackingNumber == null) {
            trackingNumber = "KK-" + System.currentTimeMillis();
        }
    }
}
