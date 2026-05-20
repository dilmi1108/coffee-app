package lk.kopikade.backend.service;

import lk.kopikade.backend.model.*;
import lk.kopikade.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public Map<String, Object> getDashboardStats() {
        List<Order> allOrders = orderRepository.findAll();
        List<User> allUsers = userRepository.findAll();
        List<Product> allProducts = productRepository.findAll();

        long totalCustomers = allUsers.stream()
                .filter(u -> u.getRole() == Role.ROLE_CUSTOMER)
                .count();

        long totalOrders = allOrders.size();

        double totalRevenue = allOrders.stream()
                .filter(o -> o.getStatus() == OrderStatus.DELIVERED || "PAID".equalsIgnoreCase(o.getPaymentStatus()))
                .mapToDouble(Order::getPayableAmount)
                .sum();

        // Calculate popular products
        Map<Product, Integer> productSales = new HashMap<>();
        for (Order o : allOrders) {
            if (o.getStatus() != OrderStatus.CANCELLED) {
                for (OrderItem item : o.getItems()) {
                    productSales.put(item.getProduct(), 
                            productSales.getOrDefault(item.getProduct(), 0) + item.getQuantity());
                }
            }
        }

        List<Map<String, Object>> popularProducts = productSales.entrySet().stream()
                .sorted(Map.Entry.<Product, Integer>comparingByValue().reversed())
                .limit(5)
                .map(entry -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", entry.getKey().getId());
                    map.put("name", entry.getKey().getName());
                    map.put("imageUrl", entry.getKey().getImageUrl());
                    map.put("salesCount", entry.getValue());
                    map.put("revenue", entry.getValue() * entry.getKey().getPrice());
                    return map;
                })
                .collect(Collectors.toList());

        // Get stock alerts (stock <= 5)
        long lowStockCount = allProducts.stream()
                .filter(p -> p.getStock() <= 5)
                .count();

        // Sales charts (last 7 days)
        Map<String, Double> salesChart = new LinkedHashMap<>();
        LocalDateTime now = LocalDateTime.now();
        for (int i = 6; i >= 0; i--) {
            LocalDateTime dayStart = now.minusDays(i).withHour(0).withMinute(0).withSecond(0).withNano(0);
            LocalDateTime dayEnd = now.minusDays(i).withHour(23).withMinute(59).withSecond(59).withNano(999999999);
            String dayName = dayStart.getDayOfWeek().name().substring(0, 3);
            
            double dayRevenue = allOrders.stream()
                    .filter(o -> o.getOrderDate().isAfter(dayStart) && o.getOrderDate().isBefore(dayEnd))
                    .filter(o -> o.getStatus() != OrderStatus.CANCELLED)
                    .mapToDouble(Order::getPayableAmount)
                    .sum();
            
            salesChart.put(dayName, dayRevenue);
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCustomers", totalCustomers);
        stats.put("totalOrders", totalOrders);
        stats.put("totalRevenue", totalRevenue);
        stats.put("lowStockCount", lowStockCount);
        stats.put("popularProducts", popularProducts);
        stats.put("salesChart", salesChart);

        return stats;
    }
}
