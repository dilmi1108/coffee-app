package lk.kopikade.backend.controller;

import jakarta.validation.Valid;
import lk.kopikade.backend.dto.MessageResponse;
import lk.kopikade.backend.dto.OrderRequest;
import lk.kopikade.backend.model.Order;
import lk.kopikade.backend.model.OrderStatus;
import lk.kopikade.backend.model.Role;
import lk.kopikade.backend.model.User;
import lk.kopikade.backend.service.OrderService;
import lk.kopikade.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*", maxAge = 3600)
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    private User getCurrentUser(Principal principal) {
        return userService.getUserByEmail(principal.getName());
    }

    @PostMapping
    public ResponseEntity<?> placeOrder(Principal principal, @Valid @RequestBody OrderRequest request) {
        try {
            User user = getCurrentUser(principal);
            Order order = orderService.placeOrder(user.getId(), request);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getMyOrders(Principal principal) {
        try {
            User user = getCurrentUser(principal);
            List<Order> orders = orderService.getOrdersByUserId(user.getId());
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id, Principal principal) {
        try {
            User user = getCurrentUser(principal);
            Order order = orderService.getOrderById(id);

            // Allow only the owner or an admin to view the details
            if (!order.getUser().getId().equals(user.getId()) && user.getRole() != Role.ROLE_ADMIN) {
                return ResponseEntity.status(403).body(new MessageResponse("Access Denied!"));
            }

            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/tracking/{trackingNumber}")
    public ResponseEntity<?> trackOrder(@PathVariable String trackingNumber) {
        try {
            Order order = orderService.getOrderByTrackingNumber(trackingNumber);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    // --- ADMIN ORDER MANAGEMENT ---

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PutMapping("/admin/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase());
            Order updated = orderService.updateOrderStatus(id, orderStatus);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid order status value!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}
