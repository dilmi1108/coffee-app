import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaCoffee, FaShoppingCart, FaUser, FaHeart, FaBars, FaTimes, FaSignOutAlt, FaShieldAlt } from 'react-icons/fa';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import api from '../api/axios';

export const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { cart, fetchCart } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
      fetchWishlistCount();
    }
  }, [isAuthenticated]);

  const fetchWishlistCount = async () => {
    try {
      const res = await api.get('/api/wishlist');
      setWishlistCount(res.data.length);
    } catch (err) {
      console.log('Error fetching wishlist count');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/menu', label: 'Menu' },
    { path: '/blog', label: 'Blog' },
    { path: '/about', label: 'About Us' },
    { path: '/contact', label: 'Contact' },
  ];

  const cartItemsCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <nav className="glass sticky top-0 z-50 w-full border-b border-coffee-100 px-4 py-3 md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo / Brand Name */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold font-display text-coffee-800 transition hover:text-coffee-600">
          <FaCoffee className="text-coffee-600 animate-pulse-slow" />
          <span className="font-sinhala text-2xl leading-none">කෝපි කඩේ</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-medium transition duration-200 hover:text-coffee-600 ${
                  isActive ? 'text-coffee-600 border-b-2 border-coffee-500 pb-1' : 'text-coffee-800'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Action Icons */}
        <div className="hidden items-center gap-6 md:flex">
          {/* Wishlist */}
          {isAuthenticated && (
            <Link to="/profile?tab=wishlist" className="relative text-coffee-800 hover:text-coffee-600 transition" title="Wishlist">
              <FaHeart className="text-xl" />
              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-coffee-600 text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>
          )}

          {/* Shopping Cart */}
          <Link to="/cart" className="relative text-coffee-800 hover:text-coffee-600 transition" title="Cart">
            <FaShoppingCart className="text-xl" />
            {cartItemsCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-coffee-600 text-[10px] font-bold text-white">
                {cartItemsCount}
              </span>
            )}
          </Link>

          {/* User Options */}
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {user?.role === 'ROLE_ADMIN' && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1 rounded-full bg-coffee-800 px-4 py-1.5 text-xs font-semibold text-white hover:bg-coffee-700 transition"
                >
                  <FaShieldAlt /> Admin Dashboard
                </Link>
              )}
              <Link to="/profile" className="flex items-center gap-1.5 text-sm font-medium text-coffee-800 hover:text-coffee-600 transition">
                <FaUser /> {user?.name?.split(' ')[0]}
              </Link>
              <button
                onClick={handleLogout}
                className="text-coffee-800 hover:text-red-600 transition"
                title="Logout"
              >
                <FaSignOutAlt className="text-lg" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-coffee-700 px-6 py-2 text-sm font-semibold text-white hover:bg-coffee-800 transition shadow-sm"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-4 md:hidden">
          <Link to="/cart" className="relative text-coffee-800 hover:text-coffee-600 transition mr-2">
            <FaShoppingCart className="text-xl" />
            {cartItemsCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-coffee-600 text-[10px] font-bold text-white">
                {cartItemsCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-coffee-800 hover:text-coffee-600 focus:outline-none"
          >
            {mobileMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="absolute left-0 right-0 top-full flex flex-col gap-4 border-b border-coffee-100 bg-coffee-50 p-6 shadow-lg md:hidden">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `text-base font-semibold transition ${isActive ? 'text-coffee-600' : 'text-coffee-800'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <hr className="border-coffee-100" />
          {isAuthenticated ? (
            <div className="flex flex-col gap-4">
              {user?.role === 'ROLE_ADMIN' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-full bg-coffee-800 py-2.5 text-sm font-semibold text-white hover:bg-coffee-700"
                >
                  <FaShieldAlt /> Admin Dashboard
                </Link>
              )}
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-full border border-coffee-300 py-2.5 text-sm font-semibold text-coffee-800"
              >
                <FaUser /> My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 rounded-full bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600"
              >
                <FaSignOutAlt /> Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-full bg-coffee-700 py-2.5 text-center text-sm font-semibold text-white hover:bg-coffee-800"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};
