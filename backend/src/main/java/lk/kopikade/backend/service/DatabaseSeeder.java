package lk.kopikade.backend.service;

import lk.kopikade.backend.model.*;
import lk.kopikade.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private BlogRepository blogRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CartService cartService;

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed Users (Admin & Customer)
        if (userRepository.count() == 0) {
            // Seed Admin User
            User admin = User.builder()
                    .name("කෝපි කඩේ Admin")
                    .email("admin@kopikade.lk")
                    .password(passwordEncoder.encode("admin123"))
                    .phone("+94771234567")
                    .role(Role.ROLE_ADMIN)
                    .loyaltyPoints(100)
                    .active(true)
                    .build();
            User savedAdmin = userRepository.save(admin);
            cartService.createCartForUser(savedAdmin);

            // Seed Customer User
            User customer = User.builder()
                    .name("මලිඳු පෙරේරා")
                    .email("customer@kopikade.lk")
                    .password(passwordEncoder.encode("customer123"))
                    .phone("+94777654321")
                    .role(Role.ROLE_CUSTOMER)
                    .loyaltyPoints(50)
                    .active(true)
                    .build();
            User savedCustomer = userRepository.save(customer);
            cartService.createCartForUser(savedCustomer);
        }

        // 2. Seed Categories
        if (categoryRepository.count() == 0) {
            Category hotCoffees = Category.builder()
                    .name("Espresso & Hot Coffees")
                    .description("Traditional hot espresso drinks brewed with freshly roasted beans.")
                    .imageUrl("https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop")
                    .build();

            Category coldCoffees = Category.builder()
                    .name("Cold Brews & Iced Coffees")
                    .description("Chilled and refreshing coffee drinks for hot tropical days.")
                    .imageUrl("https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=600&auto=format&fit=crop")
                    .build();

            Category pastries = Category.builder()
                    .name("Cakes & Pastries")
                    .description("Sweet and savory treats baked fresh in-house every morning.")
                    .imageUrl("https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop")
                    .build();

            Category beans = Category.builder()
                    .name("Coffee Beans & Merch")
                    .description("Take the Kopi Kade experience home with single-origin beans and premium mugs.")
                    .imageUrl("https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=600&auto=format&fit=crop")
                    .build();

            categoryRepository.save(hotCoffees);
            categoryRepository.save(coldCoffees);
            categoryRepository.save(pastries);
            categoryRepository.save(beans);

            // 3. Seed Products
            // Hot Coffees
            productRepository.save(Product.builder()
                    .name("Sri Lankan Spiced Latte")
                    .description("Our signature latte infused with authentic Ceylon cinnamon, green cardamom, and raw bee honey.")
                    .price(650.0)
                    .imageUrl("https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600&auto=format&fit=crop")
                    .category(hotCoffees)
                    .stock(50)
                    .active(true)
                    .ingredients("Espresso, Milk, Ceylon Cinnamon, Cardamom, Local Bee Honey")
                    .loyaltyPointsReward(10)
                    .isFeatured(true)
                    .build());

            productRepository.save(Product.builder()
                    .name("Coconut Milk Flat White")
                    .description("Smooth double shot of espresso mixed with silky, steamed fresh Sri Lankan coconut milk.")
                    .price(600.0)
                    .imageUrl("https://images.unsplash.com/photo-1577968897966-3d4325b36b61?q=80&w=600&auto=format&fit=crop")
                    .category(hotCoffees)
                    .stock(40)
                    .active(true)
                    .ingredients("Double Shot Espresso, Local Coconut Milk, Demerara Sugar")
                    .loyaltyPointsReward(8)
                    .isFeatured(true)
                    .build());

            productRepository.save(Product.builder()
                    .name("Classic Cappuccino")
                    .description("Perfect balance of rich espresso, steamed milk, and a thick layer of velvety foam topped with cocoa.")
                    .price(550.0)
                    .imageUrl("https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=600&auto=format&fit=crop")
                    .category(hotCoffees)
                    .stock(100)
                    .active(true)
                    .ingredients("Espresso, Steamed Whole Milk, Milk Foam, Cocoa Powder")
                    .loyaltyPointsReward(6)
                    .isFeatured(false)
                    .build());

            // Cold Coffees
            productRepository.save(Product.builder()
                    .name("Kopi Kade Special Cold Brew")
                    .description("Single-origin Arabica beans slowly steeped in cold water for 18 hours. Ultra-smooth, low in acidity.")
                    .price(700.0)
                    .imageUrl("https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=600&auto=format&fit=crop")
                    .category(coldCoffees)
                    .stock(30)
                    .active(true)
                    .ingredients("18-Hour Cold Brewed Single Origin Arabica, Ice")
                    .loyaltyPointsReward(12)
                    .isFeatured(true)
                    .build());

            productRepository.save(Product.builder()
                    .name("Iced Vanilla Macchiato")
                    .description("Chilled milk marked with a shot of espresso, layered with sweet vanilla syrup and caramel drizzle.")
                    .price(750.0)
                    .imageUrl("https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=600&auto=format&fit=crop")
                    .category(coldCoffees)
                    .stock(45)
                    .active(true)
                    .ingredients("Espresso, Cold Milk, Vanilla Extract, Caramel Sauce, Ice")
                    .loyaltyPointsReward(10)
                    .isFeatured(false)
                    .build());

            // Pastries
            productRepository.save(Product.builder()
                    .name("Sri Lankan Spiced Cinnamon Bun")
                    .description("Freshly baked warm sweet bun with Ceylon cinnamon spices and a local palm treacle glaze.")
                    .price(420.0)
                    .imageUrl("https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop")
                    .category(pastries)
                    .stock(15)
                    .active(true)
                    .ingredients("Wheat Flour, Yeast, Ceylon Cinnamon, Butter, Palm Treacle Glaze")
                    .loyaltyPointsReward(5)
                    .isFeatured(true)
                    .build());

            productRepository.save(Product.builder()
                    .name("Pol Pani Pancake Cake Slice")
                    .description("Decadent multi-layered crepe cake filled with sweet caramelized coconut (Pol Pani) and cardamoms.")
                    .price(580.0)
                    .imageUrl("https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600&auto=format&fit=crop")
                    .category(pastries)
                    .stock(8)
                    .active(true)
                    .ingredients("Crepes, Fresh Coconut Shavings, Kithul Jaggery, Cardamom, Cream Cheese")
                    .loyaltyPointsReward(8)
                    .isFeatured(true)
                    .build());

            // Beans & Merch
            productRepository.save(Product.builder()
                    .name("Ceylon Single Origin Coffee Beans (500g)")
                    .description("Medium roast 100% Arabica beans grown in the highlands of Kotmale. Floral notes with a chocolate finish.")
                    .price(2900.0)
                    .imageUrl("https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=600&auto=format&fit=crop")
                    .category(beans)
                    .stock(20)
                    .active(true)
                    .ingredients("100% Whole Roasted Coffee Beans")
                    .loyaltyPointsReward(30)
                    .isFeatured(true)
                    .build());
        }

        // 4. Seed Coupons
        if (couponRepository.count() == 0) {
            couponRepository.save(Coupon.builder()
                    .code("KOPIKADE10")
                    .discountPercent(10.0)
                    .maxDiscount(500.0)
                    .expiryDate(LocalDateTime.now().plusMonths(3))
                    .active(true)
                    .build());

            couponRepository.save(Coupon.builder()
                    .code("WELCOME20")
                    .discountPercent(20.0)
                    .maxDiscount(1000.0)
                    .expiryDate(LocalDateTime.now().plusMonths(1))
                    .active(true)
                    .build());
        }

        // 5. Seed Blogs
        if (blogRepository.count() == 0) {
            blogRepository.save(Blog.builder()
                    .title("Brewing the Perfect Pour-Over at Home")
                    .content("Pour-over coffee brewing is one of the cleanest and most rewarding ways to enjoy single-origin beans. In this guide, we break down the ideal water temperature, coffee-to-water ratios, and pouring techniques to help you unlock maximum flavor at home. We recommend using a medium grind and water heated to around 92°C to extract Kotmale highland beans.")
                    .author("Chef Kalhara")
                    .category("BREWING_TIPS")
                    .imageUrl("https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&auto=format&fit=crop")
                    .build());

            blogRepository.save(Blog.builder()
                    .title("The Rise of Sri Lankan Coffee")
                    .content("Sri Lanka was once a major global coffee producer in the 19th century before tea took over. Today, a new wave of local farmers and micro-roasters are reviving the island's coffee culture. From Kotmale to Ella, explore how high altitudes and rich soil are producing premium specialty beans that are catching the world's attention.")
                    .author("Dilmi Perera")
                    .category("COFFEE_NEWS")
                    .imageUrl("https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=600&auto=format&fit=crop")
                    .build());
        }
    }
}
