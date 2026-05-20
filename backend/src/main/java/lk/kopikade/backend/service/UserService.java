package lk.kopikade.backend.service;

import lk.kopikade.backend.dto.LoginRequest;
import lk.kopikade.backend.dto.SignupRequest;
import lk.kopikade.backend.dto.JwtResponse;
import lk.kopikade.backend.model.Role;
import lk.kopikade.backend.model.User;
import lk.kopikade.backend.repository.UserRepository;
import lk.kopikade.backend.security.JwtUtils;
import lk.kopikade.backend.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private CartService cartService;

    @Transactional
    public User registerUser(SignupRequest signupRequest) {
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        Role role = Role.ROLE_CUSTOMER;
        if (signupRequest.getRole() != null && signupRequest.getRole().equalsIgnoreCase("ADMIN")) {
            role = Role.ROLE_ADMIN;
        }

        User user = User.builder()
                .name(signupRequest.getName())
                .email(signupRequest.getEmail())
                .password(passwordEncoder.encode(signupRequest.getPassword()))
                .phone(signupRequest.getPhone())
                .role(role)
                .loyaltyPoints(0)
                .active(true)
                .build();

        User savedUser = userRepository.save(user);
        
        // Auto-initialize a cart for new users
        cartService.createCartForUser(savedUser);
        
        return savedUser;
    }

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String role = userDetails.getAuthorities().iterator().next().getAuthority();

        return new JwtResponse(
                jwt,
                userDetails.getId(),
                userDetails.getName(),
                userDetails.getEmail(),
                role);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    @Transactional
    public User updateUserProfile(Long id, User profileData) {
        User user = getUserById(id);
        user.setName(profileData.getName());
        user.setPhone(profileData.getPhone());
        user.setAddress(profileData.getAddress());
        return userRepository.save(user);
    }

    @Transactional
    public User toggleUserStatus(Long id) {
        User user = getUserById(id);
        user.setActive(!user.isActive());
        return userRepository.save(user);
    }

    @Transactional
    public User updateUserRole(Long id, String roleStr) {
        User user = getUserById(id);
        Role role = Role.valueOf("ROLE_" + roleStr.toUpperCase());
        user.setRole(role);
        return userRepository.save(user);
    }

    @Transactional
    public void addLoyaltyPoints(Long id, int points) {
        User user = getUserById(id);
        user.setLoyaltyPoints(user.getLoyaltyPoints() + points);
        userRepository.save(user);
    }

    @Transactional
    public void deductLoyaltyPoints(Long id, int points) {
        User user = getUserById(id);
        if (user.getLoyaltyPoints() < points) {
            throw new RuntimeException("Insufficient loyalty points!");
        }
        user.setLoyaltyPoints(user.getLoyaltyPoints() - points);
        userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
