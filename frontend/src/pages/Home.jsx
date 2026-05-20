import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaCoffee, FaAward, FaLeaf, FaTruck, FaStar, FaQuoteLeft } from 'react-icons/fa';
import api from '../api/axios';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';

export const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { addToCart } = useCartStore();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [email, setEmail] = useState('');
  const [newsLetterSubscribed, setNewsLetterSubscribed] = useState(false);

  useEffect(() => {
    fetchFeaturedProducts();
    fetchCategories();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const res = await api.get('/api/products/featured');
      setFeaturedProducts(res.data);
    } catch (err) {
      console.log('Error fetching featured products');
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

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    await addToCart(productId, 1);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setNewsLetterSubscribed(true);
      setEmail('');
    }
  };

  const testimonials = [
    {
      name: "අමිල ගුණවර්ධන",
      role: "Coffee Lover",
      comment: "The Sri Lankan Spiced Latte is a masterpiece! The blend of Ceylon cinnamon and cardamom with rich espresso is something I haven't tasted anywhere else. Highly recommend!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop"
    },
    {
      name: "සඳුනි පෙරේරා",
      role: "Pastry Enthusiast",
      comment: "The Pol Pani Crepe Cake is incredibly soft and tastes exactly like home. It pairs perfectly with the Coconut Milk Flat White. The atmosphere of their Kopi Kade is unmatched.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
    },
    {
      name: "Kasun Jayasekara",
      role: "Frequent Customer",
      comment: "Super fast delivery and their cold brew stays fresh for days in the fridge. The loyalty program is great too; I redeemed my points for a free cappuccino last week!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop"
    }
  ];

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-coffee-100 via-coffee-50 to-coffee-50 px-6 py-20 md:px-12 md:py-32">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 md:grid-cols-2">
          
          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-6 text-left"
          >
            <span className="w-fit rounded-full bg-coffee-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-coffee-700">
              ☕ Welcome to Kopi Kade
            </span>
            <h1 className="font-display font-bold leading-tight text-coffee-950 text-4xl md:text-6xl">
              Discover the Art of <span className="text-coffee-600 font-sinhala">Ceylon Coffee</span>
            </h1>
            <p className="text-base text-coffee-800 leading-relaxed max-w-lg">
              Experience the rich heritage of Sri Lankan highland coffee. Freshly roasted, ethically sourced single-origin Arabica beans, handcrafted with natural spices.
            </p>
            <div className="flex flex-wrap gap-4 mt-2">
              <Link
                to="/menu"
                className="flex items-center gap-2 rounded-full bg-coffee-700 px-8 py-3.5 text-sm font-bold text-white shadow-md hover:bg-coffee-800 transition"
              >
                Order Online <FaArrowRight />
              </Link>
              <Link
                to="/about"
                className="flex items-center gap-2 rounded-full border border-coffee-300 bg-white px-8 py-3.5 text-sm font-bold text-coffee-800 shadow-sm hover:bg-coffee-50 transition"
              >
                Our Story
              </Link>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center"
          >
            <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-coffee-300 to-coffee-100 opacity-30 blur-2xl"></div>
            <img
              src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop"
              alt="Premium Latte Coffee"
              className="relative z-10 w-full max-w-md animate-float rounded-3xl object-cover shadow-2xl border-4 border-white"
            />
          </motion.div>

        </div>
      </section>

      {/* 2. ADVANTAGES SECTION */}
      <section className="mx-auto max-w-7xl px-6 md:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 rounded-3xl bg-coffee-900 p-8 text-white shadow-xl">
          <div className="flex flex-col items-center gap-2 text-center">
            <FaCoffee className="text-3xl text-coffee-300" />
            <h4 className="text-base font-bold">100% Single Origin</h4>
            <p className="text-xs text-coffee-200">Highland beans from Kotmale</p>
          </div>
          <div className="flex flex-col items-center gap-2 text-center border-t md:border-t-0 md:border-l border-coffee-800 pt-6 md:pt-0 md:pl-6">
            <FaLeaf className="text-3xl text-coffee-300" />
            <h4 className="text-base font-bold">All Natural Spices</h4>
            <p className="text-xs text-coffee-200">Steeped with Ceylon Cinnamon</p>
          </div>
          <div className="flex flex-col items-center gap-2 text-center border-t md:border-t-0 md:border-l border-coffee-800 pt-6 md:pt-0 md:pl-6">
            <FaAward className="text-3xl text-coffee-300" />
            <h4 className="text-base font-bold">Loyalty Reward Points</h4>
            <p className="text-xs text-coffee-200">Redeem points for free items</p>
          </div>
          <div className="flex flex-col items-center gap-2 text-center border-t md:border-t-0 md:border-l border-coffee-800 pt-6 md:pt-0 md:pl-6">
            <FaTruck className="text-3xl text-coffee-300" />
            <h4 className="text-base font-bold">Fast Delivery</h4>
            <p className="text-xs text-coffee-200">Fresh and warm within Colombo</p>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES SECTION */}
      <section className="mx-auto max-w-7xl px-6 md:px-8 w-full flex flex-col gap-8">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-coffee-950">Explore Our Categories</h2>
          <p className="text-sm text-coffee-600 mt-2">Find your perfect brew and freshly baked goodies</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <Link
              to={`/menu?category=${cat.id}`}
              key={cat.id}
              className="group relative h-72 overflow-hidden rounded-2xl shadow-md transition duration-300 hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-coffee-950 via-coffee-950/40 to-transparent z-10"></div>
              <img
                src={cat.imageUrl}
                alt={cat.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />
              <div className="absolute bottom-6 left-6 right-6 z-20 text-left text-white">
                <h4 className="text-lg font-bold font-display">{cat.name}</h4>
                <p className="text-xs text-coffee-200 mt-1 line-clamp-2">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. PROMOTION BANNER */}
      <section className="mx-auto max-w-7xl px-6 md:px-8 w-full">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-coffee-800 to-coffee-950 p-8 md:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left max-w-lg">
            <span className="rounded-full bg-coffee-700/50 border border-coffee-500/30 px-3 py-1 text-xs font-semibold uppercase text-coffee-300">
              ☕ Limited Time Offer
            </span>
            <h3 className="font-display text-2xl md:text-3xl font-bold mt-4">Enjoy 20% Off Your First Order!</h3>
            <p className="text-xs text-coffee-200 mt-2">
              Use promo code <span className="font-mono text-sm font-bold text-coffee-300 bg-coffee-900/60 px-2 py-0.5 rounded">WELCOME20</span> at checkout to claim your discount.
            </p>
          </div>
          <Link
            to="/menu"
            className="whitespace-nowrap rounded-full bg-white px-8 py-3 text-sm font-bold text-coffee-900 hover:bg-coffee-100 transition shadow-md"
          >
            Claim Discount Now
          </Link>
        </div>
      </section>

      {/* 5. FEATURED PRODUCTS */}
      <section className="mx-auto max-w-7xl px-6 md:px-8 w-full flex flex-col gap-8">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-coffee-950">Handcrafted Favourites</h2>
          <p className="text-sm text-coffee-600 mt-2">Taste our highest-rated beverages and treats</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-coffee-100 shadow-sm hover:shadow-md transition duration-200"
            >
              <div className="relative h-48 overflow-hidden bg-coffee-50">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full bg-coffee-900 px-2.5 py-1 text-[10px] font-bold text-white">
                  ⭐ Featured
                </span>
                {product.loyaltyPointsReward > 0 && (
                  <span className="absolute right-3 top-3 rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-bold text-green-800">
                    +{product.loyaltyPointsReward} Points
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2 p-5 text-left flex-grow justify-between">
                <div>
                  <h4 className="font-display text-base font-bold text-coffee-950 line-clamp-1">{product.name}</h4>
                  <p className="text-xs text-coffee-600 line-clamp-2 mt-1 min-h-[32px]">{product.description}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-lg font-bold text-coffee-900">LKR {product.price.toFixed(2)}</span>
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    className="rounded-full bg-coffee-700 px-4 py-2 text-xs font-semibold text-white hover:bg-coffee-800 transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. ABOUT SECTION PREVIEW */}
      <section className="bg-coffee-100/50 py-16 px-6 md:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 items-center gap-12 md:grid-cols-2 text-left">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&auto=format&fit=crop"
              alt="Pouring Coffee"
              className="rounded-3xl shadow-xl w-full max-w-lg object-cover h-[350px] border-4 border-white"
            />
          </div>
          <div className="flex flex-col gap-5">
            <span className="w-fit rounded-full bg-coffee-200/50 px-3.5 py-1 text-xs font-bold uppercase text-coffee-800">
              ☕ Our Philosophy
            </span>
            <h2 className="font-display text-3xl font-bold text-coffee-950">Reviving Sri Lanka's Rich Coffee Heritage</h2>
            <p className="text-sm text-coffee-800 leading-relaxed">
              Long before Sri Lanka became synonymous with Ceylon Tea, it was a thriving coffee powerhouse. At <strong>කෝපි කඩේ</strong>, we are dedicated to bringing back that legacy. We source our coffee beans directly from smallholders in the Kotmale valley, helping local farmers earn fair wages while delivering premium roasts to you.
            </p>
            <Link
              to="/about"
              className="w-fit rounded-full bg-coffee-800 px-6 py-2.5 text-xs font-bold text-white hover:bg-coffee-900 transition mt-2"
            >
              Read Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-6 md:px-8 w-full flex flex-col gap-8">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-coffee-950">What Our Customers Say</h2>
          <p className="text-sm text-coffee-600 mt-2">Hear directly from the members of the Kopi Kade community</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, index) => (
            <div key={index} className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-sm border border-coffee-50/50 text-left">
              <div>
                <FaQuoteLeft className="text-3xl text-coffee-200 mb-4" />
                <p className="text-xs text-coffee-800 leading-relaxed italic">"{test.comment}"</p>
              </div>
              <div className="flex items-center gap-4 mt-6 border-t border-coffee-50 pt-4">
                <img
                  src={test.image}
                  alt={test.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <h5 className="text-sm font-bold text-coffee-950">{test.name}</h5>
                  <p className="text-[11px] text-coffee-500">{test.role}</p>
                </div>
                <div className="flex gap-0.5 ml-auto text-amber-500 text-[10px]">
                  {[...Array(test.rating)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. NEWSLETTER SUBSCRIPTION */}
      <section className="mx-auto max-w-5xl px-6 md:px-8 w-full">
        <div className="rounded-3xl bg-coffee-100 p-8 md:p-12 text-center shadow-sm border border-coffee-200/50 flex flex-col items-center gap-6">
          <div className="max-w-md">
            <h3 className="font-display text-2xl font-bold text-coffee-950">Join the Kopi Kade Club</h3>
            <p className="text-xs text-coffee-700 mt-2">
              Subscribe to get updates on seasonal brews, organic farming recipes, and exclusive flash sale promo codes.
            </p>
          </div>
          {newsLetterSubscribed ? (
            <div className="rounded-full bg-green-100 px-8 py-3 text-xs font-bold text-green-800">
              ✓ Thank you for subscribing! Check your inbox for your first gift.
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex w-full max-w-md flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow rounded-full border border-coffee-300 bg-white px-5 py-3 text-xs text-coffee-900 focus:border-coffee-500 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-full bg-coffee-800 px-6 py-3 text-xs font-bold text-white hover:bg-coffee-900 transition shadow-sm"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
};
