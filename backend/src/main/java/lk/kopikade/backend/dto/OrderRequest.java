package lk.kopikade.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OrderRequest {
    @NotBlank
    private String deliveryAddress;

    @NotBlank
    private String phone;

    @NotBlank
    private String paymentMethod; // "CARD", "CASH", "LOYALTY_POINTS"

    private String couponCode;
}
