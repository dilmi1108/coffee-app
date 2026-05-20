package lk.kopikade.backend.service;

import lk.kopikade.backend.model.Product;
import lk.kopikade.backend.model.User;
import lk.kopikade.backend.model.WishlistItem;
import lk.kopikade.backend.repository.ProductRepository;
import lk.kopikade.backend.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ProductRepository productRepository;

    @Transactional
    public WishlistItem addToWishlist(Long userId, Long productId) {
        if (isInWishlist(userId, productId)) {
            return wishlistRepository.findByUserIdAndProductId(userId, productId).orElse(null);
        }

        User user = userService.getUserById(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        WishlistItem item = WishlistItem.builder()
                .user(user)
                .product(product)
                .build();

        return wishlistRepository.save(item);
    }

    @Transactional
    public void removeFromWishlist(Long userId, Long productId) {
        wishlistRepository.deleteByUserIdAndProductId(userId, productId);
    }

    public List<WishlistItem> getWishlistByUserId(Long userId) {
        return wishlistRepository.findByUserId(userId);
    }

    public boolean isInWishlist(Long userId, Long productId) {
        return wishlistRepository.findByUserIdAndProductId(userId, productId).isPresent();
    }
}
