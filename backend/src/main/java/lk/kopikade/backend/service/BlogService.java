package lk.kopikade.backend.service;

import lk.kopikade.backend.model.Blog;
import lk.kopikade.backend.repository.BlogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class BlogService {

    @Autowired
    private BlogRepository blogRepository;

    @Transactional
    public Blog createBlog(Blog blog) {
        return blogRepository.save(blog);
    }

    @Transactional
    public Blog updateBlog(Long id, Blog blogData) {
        Blog blog = getBlogById(id);
        blog.setTitle(blogData.getTitle());
        blog.setContent(blogData.getContent());
        blog.setAuthor(blogData.getAuthor());
        blog.setImageUrl(blogData.getImageUrl());
        blog.setCategory(blogData.getCategory());
        return blogRepository.save(blog);
    }

    @Transactional
    public void deleteBlog(Long id) {
        Blog blog = getBlogById(id);
        blogRepository.delete(blog);
    }

    public Blog getBlogById(Long id) {
        return blogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog post not found with id: " + id));
    }

    public List<Blog> getAllBlogs() {
        return blogRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Blog> getBlogsByCategory(String category) {
        return blogRepository.findByCategoryOrderByCreatedAtDesc(category);
    }
}
