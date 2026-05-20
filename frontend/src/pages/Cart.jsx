import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaCoffee, FaShoppingCart, FaArrowRight, FaTicketAlt, FaTimes } from 'react-icons/fa';
import { useCartStore } from '../store/useCartStore';

export const Cart = () => {
  const navigate = useNavigate();
  const { cart, loading, fetchCart, updateQuantity, removeItem, clearCart, applyCoupon, removeCoupon, coupon } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = async (productId, currentQuantity, change) => {
    const newQty = currentQuantity + change;
    await updateQuantity(productId, newQty);
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess(false);

    if (!couponCode.trim()) return;

    const res = await applyCoupon(couponCode.trim());
    if (res.success) {
      setCouponSuccess(true);
      setCouponCode('');
    } else {
      setCouponError(res.error || 'Invalid or expired coupon code.');
    }
  };

  // Calculations
  const subtotal = cart?.items?.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) || 0;
  
  let discount = 0;
  if (coupon && subtotal > 0) {
    discount = (subtotal * coupon.discountPercent) / 100;
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  }

  const payableAmount = Math.max(0, subtotal - discount);

  if (loading && !cart) {
    return (
      <div className="flex h-[60vh] items-center justify-center bg-coffee-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-coffee-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-8 flex flex-col gap-10">
      {/* Page Header */}
      <div className="text-left border-b border-coffee-100 pb-6">
        <h1 className="font-display text-4xl font-extrabold text-coffee-950">Shopping Cart</h1>
        <p className="text-sm text-coffee-600 mt-2">Review your selected brews and pastries before checking out.</p>
      </div>

      {!cart?.items || cart.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white border border-coffee-100 rounded-3xl min-h-[350px]">
          <div className="rounded-full bg-coffee-100 p-6 text-coffee-800 mb-6">
            <FaShoppingCart className="text-5xl" />
          </div>
          <h3 className="font-display text-xl font-bold text-coffee-900">Your Cart is Empty</h3>
          <p className="text-xs text-coffee-600 mt-1 max-w-xs text-center">
            Looks like you haven't added any of our delicious handcrafted drinks or pastries yet.
          </p>
          <Link
            to="/menu"
            className="rounded-full bg-coffee-700 px-8 py-3 text-sm font-bold text-white shadow-md hover:bg-coffee-800 transition mt-6"
          >
            Explore Menu
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Cart Items List */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex justify-between items-center bg-white border border-coffee-100 p-4 rounded-2xl shadow-sm">
              <span className="text-xs font-bold text-coffee-800">
                You have {cart.items.reduce((sum, item) => sum + item.quantity, 0)} item(s) in your cart
              </span>
              <button
                onClick={clearCart}
                className="text-xs font-bold text-red-600 hover:text-red-800 hover:underline"
              >
                Clear Cart
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-center gap-4 bg-white border border-coffee-100 p-5 rounded-2xl shadow-sm text-left"
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="h-20 w-20 rounded-xl object-cover border border-coffee-100 shadow-sm"
                  />
                  <div className="flex-grow">
                    <span className="text-[10px] font-bold text-coffee-500 uppercase">{item.product.category?.name}</span>
                    <h4 className="font-display text-sm font-bold text-coffee-950 mt-0.5">{item.product.name}</h4>
                    <p className="text-xs font-semibold text-coffee-700 mt-1">LKR {item.product.price.toFixed(2)}</p>
                  </div>

                  {/* Quantity selector */}
                  <div className="flex items-center gap-3 bg-coffee-50 px-3 py-1.5 rounded-full border border-coffee-150">
                    <button
                      onClick={() => handleQuantityChange(item.product.id, item.quantity, -1)}
                      className="text-sm font-extrabold text-coffee-800 hover:text-coffee-600 focus:outline-none"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-coffee-950 min-w-[16px] text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.product.id, item.quantity, 1)}
                      className="text-sm font-extrabold text-coffee-800 hover:text-coffee-600 focus:outline-none"
                    >
                      +
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right sm:min-w-[100px]">
                    <p className="text-[10px] font-bold text-coffee-500 uppercase">Total</p>
                    <p className="text-sm font-extrabold text-coffee-950 mt-0.5">
                      LKR {(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="rounded-full bg-red-50 p-2.5 text-red-500 border border-red-100 hover:bg-red-100 transition sm:ml-2"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout Summary Card */}
          <div className="lg:col-span-1 flex flex-col gap-6 text-left">
            
            {/* Coupon Card */}
            <div className="bg-white border border-coffee-100 p-6 rounded-2xl shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-coffee-800 mb-4 flex items-center gap-1.5">
                <FaTicketAlt /> Coupon Discount
              </h3>
              {coupon ? (
                <div className="flex items-center justify-between rounded-xl bg-green-50 border border-green-200 p-4 text-xs">
                  <div>
                    <p className="font-bold text-green-900">{coupon.code}</p>
                    <p className="text-[10px] text-green-700">{coupon.discountPercent}% Off Applied</p>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-red-500 hover:text-red-700"
                    title="Remove Coupon"
                  >
                    <FaTimes />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-grow rounded-xl border border-coffee-200 bg-white px-4 py-2.5 text-xs text-coffee-900 focus:border-coffee-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-coffee-800 px-5 py-2.5 text-xs font-bold text-white hover:bg-coffee-900 transition"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponSuccess && (
                <p className="text-[11px] font-bold text-green-700 mt-2">✓ Coupon applied successfully!</p>
              )}
              {couponError && (
                <p className="text-[11px] font-bold text-red-700 mt-2">✗ {couponError}</p>
              )}
            </div>

            {/* Total Payable Card */}
            <div className="bg-white border border-coffee-100 p-6 rounded-2xl shadow-sm flex flex-col gap-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-coffee-800 border-b border-coffee-100 pb-2">
                Order Summary
              </h3>
              
              <div className="flex justify-between text-xs text-coffee-700">
                <span>Subtotal</span>
                <span>LKR {subtotal.toFixed(2)}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-xs text-green-700 font-medium">
                  <span>Discount</span>
                  <span>- LKR {discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-xs text-coffee-700">
                <span>Delivery Fee</span>
                <span className="italic text-[11px]">Calculated at next step</span>
              </div>

              <hr className="border-coffee-100" />

              <div className="flex justify-between items-center text-coffee-950">
                <span className="text-sm font-bold">Total Payable</span>
                <span className="text-lg font-extrabold text-coffee-900">LKR {payableAmount.toFixed(2)}</span>
              </div>

              <Link
                to="/checkout"
                className="flex items-center justify-center gap-2 rounded-full bg-coffee-700 py-3.5 text-xs font-bold text-white shadow-md hover:bg-coffee-800 transition mt-4"
              >
                Proceed to Checkout <FaArrowRight />
              </Link>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
