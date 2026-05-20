import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaStar, FaShoppingCart, FaTimes, FaHeart, FaExclamationCircle, FaUser, FaCoffee } from 'react-icons/fa';
import api from '../api/axios';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';

export const Menu = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated, user } = useAuthStore();
  const { addToCart } = useCartStore();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState(3000);
  
  // Modal state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productReviews, setProductReviews] = useState([]);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated]);

  // Read URL query parameter for category
  useEffect(() => {
    const catId = searchParams.get('category');
    if (catId) {
      setSelectedCategory(catId);
    } else {
      setSelectedCategory('all');
    }
  }, [searchParams]);

  // Apply filters
  useEffect(() => {
    let result = products;

    if (searchQuery.trim()) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category?.id?.toString() === selectedCategory.toString());
    }

    result = result.filter(p => p.price <= maxPrice);

    setFilteredProducts(result);
  }, [searchQuery, selectedCategory, maxPrice, products]);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/api/products');
      setProducts(res.data);
      setFilteredProducts(res.data);
    } catch (err) {
      console.log('Error fetching products');
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/categories');
      setCategories(res.data);
    } catch (err) {
      console.log('Error fetching categories');
    }
  };

  const fetchWishlist = async () => {
    try {
      const res = await api.get('/api/wishlist');
      setWishlistIds(res.data.map(item => item.product.id));
    } catch (err) {
      console.log('Error fetching wishlist');
    }
  };

  const handleToggleWishlist = async (productId, e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const isBookmarked = wishlistIds.includes(productId);
    try {
      if (isBookmarked) {
        await api.delete(`/api/wishlist/${productId}`);
        setWishlistIds(wishlistIds.filter(id => id !== productId));
      } else {
        await api.post(`/api/wishlist/${productId}`);
        setWishlistIds([...wishlistIds, productId]);
      }
    } catch (err) {
      console.log('Error toggling wishlist');
    }
  };

  const handleCategorySelect = (id) => {
    if (id === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', id);
    }
    setSearchParams(searchParams);
  };

  const handleAddToCart = async (productId, e) => {
    if (e) e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    await addToCart(productId, 1);
  };

  // Product modal open & review fetch
  const handleOpenProduct = async (product) => {
    setSelectedProduct(product);
    setNewReviewComment('');
    setNewReviewRating(5);
    setReviewSuccess(false);
    setReviewError('');
    fetchProductReviews(product.id);
  };

  const fetchProductReviews = async (productId) => {
    try {
      const res = await api.get(`/api/reviews/product/${productId}`);
      setProductReviews(res.data);
    } catch (err) {
      console.log('Error loading reviews');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess(false);

    if (!isAuthenticated) {
      setReviewError('You must be logged in to submit a review.');
      return;
    }

    try {
      await api.post(`/api/reviews/${selectedProduct.id}`, {
        rating: newReviewRating,
        comment: newReviewComment
      });
      setReviewSuccess(true);
      setNewReviewComment('');
      // Reload reviews
      fetchProductReviews(selectedProduct.id);
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review.');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-8 flex flex-col gap-10">
      
      {/* Page Header */}
      <div className="text-left border-b border-coffee-100 pb-6">
        <h1 className="font-display text-4xl font-extrabold text-coffee-950">Handcrafted Menu</h1>
        <p className="text-sm text-coffee-600 mt-2">Explore our organic brews and culinary creations made daily.</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side: Filter Controls */}
        <div className="lg:col-span-1 flex flex-col gap-6 text-left bg-white border border-coffee-100 p-6 rounded-2xl shadow-sm h-fit">
          
          {/* Search bar */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-coffee-800">Search</h4>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-coffee-400" />
              <input
                type="text"
                placeholder="Search coffee or treats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-coffee-200 bg-white py-2.5 pl-9 pr-4 text-xs text-coffee-900 focus:border-coffee-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-coffee-800">Categories</h4>
            <div className="flex flex-col gap-1.5 mt-1">
              <button
                onClick={() => handleCategorySelect('all')}
                className={`w-full rounded-xl px-4 py-2.5 text-left text-xs font-semibold transition ${
                  selectedCategory === 'all'
                    ? 'bg-coffee-700 text-white shadow-sm'
                    : 'bg-coffee-50/50 text-coffee-800 hover:bg-coffee-100/50'
                }`}
              >
                All Menu Items
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`w-full rounded-xl px-4 py-2.5 text-left text-xs font-semibold transition ${
                    selectedCategory?.toString() === cat.id?.toString()
                      ? 'bg-coffee-700 text-white shadow-sm'
                      : 'bg-coffee-50/50 text-coffee-800 hover:bg-coffee-100/50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-coffee-800">Max Price (LKR)</h4>
            <input
              type="range"
              min="300"
              max="3000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-coffee-700 cursor-pointer h-1.5 bg-coffee-100 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[11px] font-bold text-coffee-700 mt-1">
              <span>LKR 300</span>
              <span>LKR {maxPrice}</span>
            </div>
          </div>

        </div>

        {/* Right Side: Product Grid */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white border border-coffee-100 rounded-2xl min-h-[300px]">
              <FaCoffee className="text-5xl text-coffee-200 animate-pulse-slow mb-4" />
              <h4 className="text-base font-bold text-coffee-800">No Items Found</h4>
              <p className="text-xs text-coffee-500 mt-1">Try expanding your filters or search keywords.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleOpenProduct(product)}
                  className="group flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-coffee-100 shadow-sm hover:shadow-md transition duration-200 cursor-pointer text-left"
                >
                  <div className="relative h-44 overflow-hidden bg-coffee-50">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    
                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => handleToggleWishlist(product.id, e)}
                      className={`absolute right-3 top-3 rounded-full p-2 border shadow-sm transition ${
                        wishlistIds.includes(product.id)
                          ? 'bg-red-50 border-red-200 text-red-500'
                          : 'bg-white/80 border-coffee-100 text-coffee-600 hover:text-red-500'
                      }`}
                    >
                      <FaHeart className="text-xs" />
                    </button>

                    {product.loyaltyPointsReward > 0 && (
                      <span className="absolute left-3 top-3 rounded-full bg-green-50/90 border border-green-200/50 px-2.5 py-0.5 text-[9px] font-bold text-green-800">
                        +{product.loyaltyPointsReward} Points
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2 p-5 flex-grow justify-between">
                    <div>
                      <h4 className="font-display text-sm font-bold text-coffee-950 line-clamp-1">{product.name}</h4>
                      <p className="text-[11px] text-coffee-600 line-clamp-2 mt-1 min-h-[30px] leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-coffee-500">Price</span>
                        <span className="text-sm font-bold text-coffee-900">LKR {product.price.toFixed(2)}</span>
                      </div>
                      <button
                        onClick={(e) => handleAddToCart(product.id, e)}
                        disabled={product.stock <= 0}
                        className={`rounded-full px-4 py-2 text-xs font-semibold text-white transition ${
                          product.stock <= 0
                            ? 'bg-coffee-300 cursor-not-allowed'
                            : 'bg-coffee-700 hover:bg-coffee-800'
                        }`}
                      >
                        {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* PRODUCT DETAILS MODAL (WITH REVIEWS) */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-coffee-100 flex flex-col md:flex-row max-h-[90vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute right-4 top-4 z-20 rounded-full bg-white/80 p-2 text-coffee-800 hover:text-coffee-600 focus:outline-none"
              >
                <FaTimes />
              </button>

              {/* Left Side: Product Image & Info */}
              <div className="w-full md:w-1/2 bg-coffee-50/50 p-6 flex flex-col gap-4 text-left border-r border-coffee-50">
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  className="w-full h-56 rounded-2xl object-cover shadow-sm border border-coffee-100"
                />
                <div>
                  <span className="rounded-full bg-coffee-100 px-3 py-1 text-[10px] font-bold text-coffee-700 uppercase">
                    {selectedProduct.category?.name}
                  </span>
                  <h3 className="font-display text-xl font-bold text-coffee-950 mt-2">{selectedProduct.name}</h3>
                  <p className="text-xs text-coffee-700 leading-relaxed mt-2">{selectedProduct.description}</p>
                </div>
                
                {selectedProduct.ingredients && (
                  <div className="flex flex-col gap-1 border-t border-coffee-100 pt-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-coffee-500">Ingredients</span>
                    <p className="text-xs text-coffee-800 italic leading-relaxed">{selectedProduct.ingredients}</p>
                  </div>
                )}

                <div className="mt-auto pt-3 border-t border-coffee-100 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-coffee-500 uppercase">Price</span>
                    <span className="text-lg font-bold text-coffee-900">LKR {selectedProduct.price.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => handleAddToCart(selectedProduct.id)}
                    disabled={selectedProduct.stock <= 0}
                    className={`rounded-full px-6 py-2.5 text-xs font-bold text-white transition ${
                      selectedProduct.stock <= 0
                        ? 'bg-coffee-300 cursor-not-allowed'
                        : 'bg-coffee-700 hover:bg-coffee-800'
                    }`}
                  >
                    {selectedProduct.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>

              {/* Right Side: Reviews Section */}
              <div className="w-full md:w-1/2 p-6 flex flex-col gap-5 text-left overflow-y-auto max-h-[50vh] md:max-h-[90vh]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-coffee-800 border-b border-coffee-100 pb-2">
                  Customer Reviews ({productReviews.length})
                </h4>

                {/* Reviews List */}
                <div className="flex flex-col gap-4 overflow-y-auto max-h-56 pr-2">
                  {productReviews.length === 0 ? (
                    <p className="text-xs text-coffee-500 italic py-4">No reviews yet for this product. Be the first to leave one!</p>
                  ) : (
                    productReviews.map(review => (
                      <div key={review.id} className="border-b border-coffee-50 pb-2.5">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-coffee-950 flex items-center gap-1.5">
                            <FaUser className="text-[10px] text-coffee-400" /> {review.userName}
                          </span>
                          <div className="flex gap-0.5 text-amber-500 text-[10px]">
                            {[...Array(review.rating)].map((_, i) => <FaStar key={i} />)}
                          </div>
                        </div>
                        <p className="text-xs text-coffee-700 mt-1 leading-relaxed">{review.comment}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Write Review Form */}
                {isAuthenticated ? (
                  <form onSubmit={handleReviewSubmit} className="flex flex-col gap-3.5 border-t border-coffee-100 pt-4 mt-auto">
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-coffee-800">Share Your Experience</h5>
                    
                    {reviewSuccess && (
                      <p className="text-[11px] font-bold text-green-700">✓ Review submitted! Waiting for admin approval.</p>
                    )}
                    {reviewError && (
                      <p className="text-[11px] font-bold text-red-700">✗ {reviewError}</p>
                    )}

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-coffee-700">Rating:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setNewReviewRating(star)}
                            className="text-sm focus:outline-none"
                          >
                            <FaStar className={star <= newReviewRating ? 'text-amber-500' : 'text-coffee-200'} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <textarea
                        rows="2"
                        placeholder="Write your comments here..."
                        required
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        className="w-full rounded-xl border border-coffee-200 p-3 text-xs text-coffee-950 focus:border-coffee-500 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="rounded-full bg-coffee-800 py-2.5 text-xs font-bold text-white hover:bg-coffee-900 transition"
                    >
                      Submit Review
                    </button>
                  </form>
                ) : (
                  <div className="rounded-2xl bg-coffee-50 p-4 border border-coffee-100 text-center text-xs mt-auto">
                    <p className="text-coffee-700">Please <Link to="/login" className="font-bold text-coffee-900 hover:underline">sign in</Link> to share a review for this product.</p>
                  </div>
                )}

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
