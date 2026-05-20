package lk.kopikade.backend.service;

import lk.kopikade.backend.model.Coupon;
import lk.kopikade.backend.repository.CouponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CouponService {

    @Autowired
    private CouponRepository couponRepository;

    @Transactional
    public Coupon createCoupon(Coupon coupon) {
        if (couponRepository.findByCode(coupon.getCode()).isPresent()) {
            throw new RuntimeException("Coupon already exists with code: " + coupon.getCode());
        }
        return couponRepository.save(coupon);
    }

    @Transactional
    public Coupon updateCoupon(Long id, Coupon couponData) {
        Coupon coupon = getCouponById(id);
        coupon.setCode(couponData.getCode());
        coupon.setDiscountPercent(couponData.getDiscountPercent());
        coupon.setMaxDiscount(couponData.getMaxDiscount());
        coupon.setExpiryDate(couponData.getExpiryDate());
        coupon.setActive(couponData.isActive());
        return couponRepository.save(coupon);
    }

    @Transactional
    public void deleteCoupon(Long id) {
        Coupon coupon = getCouponById(id);
        couponRepository.delete(coupon);
    }

    public Coupon getCouponById(Long id) {
        return couponRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coupon not found with id: " + id));
    }

    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    public Coupon validateCoupon(String code) {
        Coupon coupon = couponRepository.findByCodeAndActiveTrue(code)
                .orElseThrow(() -> new RuntimeException("Coupon code is invalid or inactive!"));

        if (coupon.isExpired()) {
            throw new RuntimeException("Coupon code has expired!");
        }

        return coupon;
    }
}
