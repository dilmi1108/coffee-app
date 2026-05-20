package lk.kopikade.backend.service;

import lk.kopikade.backend.dto.OrderRequest;
import lk.kopikade.backend.model.*;
import lk.kopikade.backend.repository.OrderItemRepository;
import lk.kopikade.backend.repository.OrderRepository;
import lk.kopikade.backend.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private CartService cartService;

    @Autowired
    private ProductService productService;

    @Autowired
    private CouponService couponService;

    @Autowired
    private PaymentRepository paymentRepository;

    @Transactional
    public Order placeOrder(Long userId, OrderRequest orderRequest) {
        User user = userService.getUserById(userId);
        Cart cart = cartService.getCartByUserId(userId);

        if (cart == null || cart.getItems().isEmpty()) {
            throw new RuntimeException("Cannot place order with an empty cart!");
        }

        // Calculate totals
        double totalAmount = 0.0;
        int loyaltyPointsToEarn = 0;
        
        for (CartItem item : cart.getItems()) {
            // Verify stock again
            if (item.getProduct().getStock() < item.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + item.getProduct().getName());
            }
            totalAmount += item.getProduct().getPrice() * item.getQuantity();
            
            // Calculate loyalty points
            Integer points = item.getProduct().getLoyaltyPointsReward();
            loyaltyPointsToEarn += (points != null ? points : 0) * item.getQuantity();
        }

        // Apply coupon if present
        double discountAmount = 0.0;
        if (orderRequest.getCouponCode() != null && !orderRequest.getCouponCode().trim().isEmpty()) {
            try {
                Coupon coupon = couponService.validateCoupon(orderRequest.getCouponCode());
                discountAmount = (totalAmount * coupon.getDiscountPercent()) / 100.0;
                if (coupon.getMaxDiscount() != null && discountAmount > coupon.getMaxDiscount()) {
                    discountAmount = coupon.getMaxDiscount();
                }
            } catch (Exception e) {
                // Log and bypass coupon discount if invalid
            }
        }

        double payableAmount = totalAmount - discountAmount;
        if (payableAmount < 0) payableAmount = 0.0;

        // Loyalty Points Payment Option
        if ("LOYALTY_POINTS".equalsIgnoreCase(orderRequest.getPaymentMethod())) {
            // 1 loyalty point = 1 LKR (custom exchange rate rule)
            int pointsNeeded = (int) Math.round(payableAmount);
            if (user.getLoyaltyPoints() < pointsNeeded) {
                throw new RuntimeException("Insufficient loyalty points! You need " + pointsNeeded + " points.");
            }
            userService.deductLoyaltyPoints(userId, pointsNeeded);
        }

        // Create Order object
        Order order = Order.builder()
                .user(user)
                .totalAmount(totalAmount)
                .discountAmount(discountAmount)
                .payableAmount(payableAmount)
                .status(OrderStatus.PENDING)
                .paymentMethod(orderRequest.getPaymentMethod())
                .deliveryAddress(orderRequest.getDeliveryAddress())
                .phone(orderRequest.getPhone())
                .build();

        if ("LOYALTY_POINTS".equalsIgnoreCase(orderRequest.getPaymentMethod())) {
            order.setPaymentStatus("PAID");
        } else {
            order.setPaymentStatus("PENDING");
        }

        Order savedOrder = orderRepository.save(order);

        // Create Order Items and update product stocks
        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem item : cart.getItems()) {
            // Deduct stock
            productService.updateStock(item.getProduct().getId(), -item.getQuantity());

            OrderItem orderItem = OrderItem.builder()
                    .order(savedOrder)
                    .product(item.getProduct())
                    .quantity(item.getQuantity())
                    .price(item.getProduct().getPrice())
                    .build();
            
            orderItemRepository.save(orderItem);
            orderItems.add(orderItem);
        }

        savedOrder.setItems(orderItems);
        orderRepository.save(savedOrder);

        // Create Payment log
        Payment payment = Payment.builder()
                .order(savedOrder)
                .paymentMethod(orderRequest.getPaymentMethod())
                .paymentStatus(savedOrder.getPaymentStatus())
                .amount(payableAmount)
                .transactionId("TXN-" + System.currentTimeMillis())
                .build();
        paymentRepository.save(payment);

        // Add earned loyalty points to customer
        if (!"LOYALTY_POINTS".equalsIgnoreCase(orderRequest.getPaymentMethod()) && loyaltyPointsToEarn > 0) {
            userService.addLoyaltyPoints(userId, loyaltyPointsToEarn);
        }

        // Clear the user's shopping cart
        cartService.clearCart(userId);

        return savedOrder;
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }

    public Order getOrderByTrackingNumber(String trackingNumber) {
        return orderRepository.findByTrackingNumber(trackingNumber)
                .orElseThrow(() -> new RuntimeException("Order not found with tracking: " + trackingNumber));
    }

    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserIdOrderByOrderDateDesc(userId);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = getOrderById(orderId);
        order.setStatus(status);
        
        // If order marked as Delivered, update payment status if it was cash on delivery
        if (status == OrderStatus.DELIVERED) {
            order.setPaymentStatus("PAID");
            Payment payment = paymentRepository.findByOrderId(orderId).orElse(null);
            if (payment != null) {
                payment.setPaymentStatus("PAID");
                paymentRepository.save(payment);
            }
        }
        
        // If order Cancelled, restore product stock levels
        if (status == OrderStatus.CANCELLED) {
            for (OrderItem item : order.getItems()) {
                productService.updateStock(item.getProduct().getId(), item.getQuantity());
            }
        }

        return orderRepository.save(order);
    }
}
