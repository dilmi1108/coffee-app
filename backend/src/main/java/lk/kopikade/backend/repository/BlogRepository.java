package lk.kopikade.backend.repository;

import lk.kopikade.backend.model.Blog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {
    List<Blog> findAllByOrderByCreatedAtDesc();
    List<Blog> findByCategoryOrderByCreatedAtDesc(String category);
}
