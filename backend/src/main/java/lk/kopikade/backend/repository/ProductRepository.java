package lk.kopikade.backend.repository;

import lk.kopikade.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByActiveTrue();
    List<Product> findByCategoryIdAndActiveTrue(Long categoryId);
    List<Product> findByNameContainingIgnoreCaseAndActiveTrue(String name);
    List<Product> findByIsFeaturedTrueAndActiveTrue();
    List<Product> findByStockLessThanEqual(Integer stockLimit);
    List<Product> findByCategoryId(Long categoryId);
}
