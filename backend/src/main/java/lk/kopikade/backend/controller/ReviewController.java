package lk.kopikade.backend.controller;

import lk.kopikade.backend.dto.MessageResponse;
import lk.kopikade.backend.model.Review;
import lk.kopikade.backend.model.User;
import lk.kopikade.backend.service.ReviewService;
import lk.kopikade.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private UserService userService;

    @PostMapping("/{productId}")
    public ResponseEntity<?> createReview(Principal principal, @PathVariable Long productId, @RequestBody Review review) {
        try {
            User user = userService.getUserByEmail(principal.getName());
            Review created = reviewService.createReview(user.getId(), productId, review);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Review>> getApprovedReviewsByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getApprovedReviewsByProduct(productId));
    }

    // --- ADMIN REVIEW ENDPOINTS ---

    @GetMapping("/admin/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Review>> getPendingReviews() {
        return ResponseEntity.ok(reviewService.getPendingReviews());
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Review>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    @PutMapping("/admin/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> approveReview(@PathVariable Long id) {
        try {
            Review approved = reviewService.approveReview(id);
            return ResponseEntity.ok(approved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteReview(@PathVariable Long id) {
        try {
            reviewService.deleteReview(id);
            return ResponseEntity.ok(new MessageResponse("Review deleted successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}
