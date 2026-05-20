package lk.kopikade.backend.service;

import lk.kopikade.backend.model.Category;
import lk.kopikade.backend.model.Product;
import lk.kopikade.backend.repository.CategoryRepository;
import lk.kopikade.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    // --- CATEGORY CRUD ---

    @Transactional
    public Category createCategory(Category category) {
        if (categoryRepository.findByName(category.getName()).isPresent()) {
            throw new RuntimeException("Category already exists with name: " + category.getName());
        }
        return categoryRepository.save(category);
    }

    @Transactional
    public Category updateCategory(Long id, Category categoryData) {
        Category category = getCategoryById(id);
        category.setName(categoryData.getName());
        category.setDescription(categoryData.getDescription());
        category.setImageUrl(categoryData.getImageUrl());
        return categoryRepository.save(category);
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = getCategoryById(id);
        categoryRepository.delete(category);
    }

    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // --- PRODUCT CRUD ---

    @Transactional
    public Product createProduct(Product product, Long categoryId) {
        Category category = getCategoryById(categoryId);
        product.setCategory(category);
        return productRepository.save(product);
    }

    @Transactional
    public Product updateProduct(Long id, Product productData, Long categoryId) {
        Product product = getProductById(id);
        Category category = getCategoryById(categoryId);

        product.setName(productData.getName());
        product.setDescription(productData.getDescription());
        product.setPrice(productData.getPrice());
        product.setImageUrl(productData.getImageUrl());
        product.setCategory(category);
        product.setStock(productData.getStock());
        product.setActive(productData.isActive());
        product.setIngredients(productData.getIngredients());
        product.setLoyaltyPointsReward(productData.getLoyaltyPointsReward());
        product.setFeatured(productData.isFeatured());

        return productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getActiveProducts() {
        return productRepository.findByActiveTrue();
    }

    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryIdAndActiveTrue(categoryId);
    }

    public List<Product> searchProducts(String name) {
        return productRepository.findByNameContainingIgnoreCaseAndActiveTrue(name);
    }

    public List<Product> getFeaturedProducts() {
        return productRepository.findByIsFeaturedTrueAndActiveTrue();
    }

    public List<Product> getLowStockProducts() {
        return productRepository.findByStockLessThanEqual(5); // Alert when stock is 5 or less
    }

    @Transactional
    public void updateStock(Long productId, int quantityChange) {
        Product product = getProductById(productId);
        int newStock = product.getStock() + quantityChange;
        if (newStock < 0) {
            throw new RuntimeException("Insufficient stock for product: " + product.getName());
        }
        product.setStock(newStock);
        productRepository.save(product);
    }
}
