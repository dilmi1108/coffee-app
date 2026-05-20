package lk.kopikade.backend.service;

import lk.kopikade.backend.model.Product;
import lk.kopikade.backend.model.Review;
import lk.kopikade.backend.model.User;
import lk.kopikade.backend.repository.ProductRepository;
import lk.kopikade.backend.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ProductRepository productRepository;

    @Transactional
    public Review createReview(Long userId, Long productId, Review reviewData) {
        User user = userService.getUserById(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        Review review = Review.builder()
                .user(user)
                .product(product)
                .userName(user.getName())
                .rating(reviewData.getRating())
                .comment(reviewData.getComment())
                .approved(false) // Admin must approve review
                .build();

        return reviewRepository.save(review);
    }

    @Transactional
    public Review approveReview(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + id));
        review.setApproved(true);
        return reviewRepository.save(review);
    }

    @Transactional
    public void deleteReview(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + id));
        reviewRepository.delete(review);
    }

    public List<Review> getApprovedReviewsByProduct(Long productId) {
        return reviewRepository.findByProductIdAndApprovedTrue(productId);
    }

    public List<Review> getPendingReviews() {
        return reviewRepository.findByApprovedFalse();
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }
}
