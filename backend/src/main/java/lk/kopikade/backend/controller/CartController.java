package lk.kopikade.backend.controller;

import jakarta.validation.Valid;
import lk.kopikade.backend.dto.CartItemRequest;
import lk.kopikade.backend.dto.MessageResponse;
import lk.kopikade.backend.model.Cart;
import lk.kopikade.backend.model.User;
import lk.kopikade.backend.service.CartService;
import lk.kopikade.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private UserService userService;

    private Long getUserId(Principal principal) {
        User user = userService.getUserByEmail(principal.getName());
        return user.getId();
    }

    @GetMapping
    public ResponseEntity<?> getCart(Principal principal) {
        try {
            Long userId = getUserId(principal);
            Cart cart = cartService.getCartByUserId(userId);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> addItemToCart(Principal principal, @Valid @RequestBody CartItemRequest request) {
        try {
            Long userId = getUserId(principal);
            Cart cart = cartService.addItemToCart(userId, request.getProductId(), request.getQuantity());
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PutMapping
    public ResponseEntity<?> updateCartItemQuantity(Principal principal, @Valid @RequestBody CartItemRequest request) {
        try {
            Long userId = getUserId(principal);
            Cart cart = cartService.updateCartItemQuantity(userId, request.getProductId(), request.getQuantity());
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<?> removeItemFromCart(Principal principal, @PathVariable Long productId) {
        try {
            Long userId = getUserId(principal);
            Cart cart = cartService.removeItemFromCart(userId, productId);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(Principal principal) {
        try {
            Long userId = getUserId(principal);
            cartService.clearCart(userId);
            return ResponseEntity.ok(new MessageResponse("Cart cleared successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}
