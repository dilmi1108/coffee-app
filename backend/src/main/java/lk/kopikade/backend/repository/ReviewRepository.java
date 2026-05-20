package lk.kopikade.backend.repository;

import lk.kopikade.backend.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProductIdAndApprovedTrue(Long productId);
    List<Review> findByApprovedFalse();
    List<Review> findByApprovedTrue();
}
