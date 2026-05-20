package lk.kopikade.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "coupons")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(name = "discount_percent", nullable = false)
    private Double discountPercent; // e.g. 15.0 for 15%

    @Column(name = "max_discount")
    private Double maxDiscount; // Max discount in currency

    @Column(name = "expiry_date")
    private LocalDateTime expiryDate;

    private boolean active = true;

    public boolean isExpired() {
        return expiryDate != null && expiryDate.isBefore(LocalDateTime.now());
    }
}
