package lk.kopikade.backend.controller;

import lk.kopikade.backend.dto.MessageResponse;
import lk.kopikade.backend.model.User;
import lk.kopikade.backend.model.WishlistItem;
import lk.kopikade.backend.service.UserService;
import lk.kopikade.backend.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "*", maxAge = 3600)
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @Autowired
    private UserService userService;

    private Long getUserId(Principal principal) {
        User user = userService.getUserByEmail(principal.getName());
        return user.getId();
    }

    @GetMapping
    public ResponseEntity<?> getMyWishlist(Principal principal) {
        try {
            Long userId = getUserId(principal);
            List<WishlistItem> wishlist = wishlistService.getWishlistByUserId(userId);
            return ResponseEntity.ok(wishlist);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/{productId}")
    public ResponseEntity<?> addToWishlist(Principal principal, @PathVariable Long productId) {
        try {
            Long userId = getUserId(principal);
            WishlistItem item = wishlistService.addToWishlist(userId, productId);
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<?> removeFromWishlist(Principal principal, @PathVariable Long productId) {
        try {
            Long userId = getUserId(principal);
            wishlistService.removeFromWishlist(userId, productId);
            return ResponseEntity.ok(new MessageResponse("Removed from wishlist successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}
