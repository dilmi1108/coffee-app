import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhone, FaCreditCard, FaMoneyBillWave, FaChevronRight, FaLock, FaExclamationCircle } from 'react-icons/fa';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';

export const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { cart, checkout, loading, coupon } = useCartStore();

  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [paymentMethod, setPaymentMethod] = useState('CASH_ON_DELIVERY');
  const [errorMsg, setErrorMsg] = useState('');
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  useEffect(() => {
    // Redirect if cart is empty
    if (!cart?.items || cart.items.length === 0) {
      if (!checkoutSuccess) {
        navigate('/cart');
      }
    }
  }, [cart, checkoutSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!deliveryAddress.trim()) {
      setErrorMsg('Delivery address is required.');
      return;
    }

    if (!phone.trim()) {
      setErrorMsg('Contact phone number is required.');
      return;
    }

    const res = await checkout(deliveryAddress, phone, paymentMethod);
    if (res.success) {
      setCheckoutSuccess(true);
      setPlacedOrder(res.order);
    } else {
      setErrorMsg(res.error || 'Failed to place order.');
    }
  };

  const subtotal = cart?.items?.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) || 0;
  
  let discount = 0;
  if (coupon && subtotal > 0) {
    discount = (subtotal * coupon.discountPercent) / 100;
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  }

  // Delivery fee setup: flat 250 LKR inside Colombo
  const deliveryFee = 250.0;
  const payableAmount = Math.max(0, subtotal - discount + deliveryFee);

  if (checkoutSuccess && placedOrder) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20 text-center flex flex-col items-center gap-6">
        <div className="rounded-full bg-green-100 p-6 text-green-800 animate-bounce">
          <span className="text-5xl font-extrabold">✓</span>
        </div>
        <h2 className="font-display text-3xl font-bold text-coffee-950">Order Placed Successfully!</h2>
        <p className="text-xs text-coffee-600 max-w-sm">
          Thank you for choosing කෝපි කඩේ! Your order has been registered and is now sent to the barista prep desk.
        </p>

        <div className="w-full rounded-2xl border border-coffee-100 bg-white p-6 shadow-sm text-left flex flex-col gap-3">
          <div className="flex justify-between text-xs">
            <span className="text-coffee-500 font-bold uppercase">Order ID</span>
            <span className="font-bold text-coffee-950">#KK-{placedOrder.id}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-coffee-500 font-bold uppercase">Tracking No</span>
            <span className="font-mono font-bold text-coffee-900">{placedOrder.trackingNumber}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-coffee-500 font-bold uppercase">Payable Total</span>
            <span className="font-bold text-coffee-950">LKR {placedOrder.payableAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-coffee-500 font-bold uppercase">Payment Status</span>
            <span className="font-bold text-coffee-950">{placedOrder.paymentStatus}</span>
          </div>
        </div>

        <div className="flex gap-4 w-full mt-4">
          <Link
            to={`/track/${placedOrder.trackingNumber}`}
            className="flex-grow rounded-full bg-coffee-700 py-3.5 text-xs font-bold text-white hover:bg-coffee-800 transition shadow-md text-center"
          >
            Track Order
          </Link>
          <Link
            to="/menu"
            className="flex-grow rounded-full border border-coffee-300 bg-white py-3.5 text-xs font-bold text-coffee-800 hover:bg-coffee-50 transition shadow-sm text-center"
          >
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-8 flex flex-col gap-10">
      
      {/* Page Header */}
      <div className="text-left border-b border-coffee-100 pb-6">
        <h1 className="font-display text-4xl font-extrabold text-coffee-950">Checkout</h1>
        <p className="text-sm text-coffee-600 mt-2">Enter your delivery address and choose a payment method below.</p>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-xs font-medium text-red-800 border border-red-150 text-left">
          <FaExclamationCircle className="text-lg shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10 text-left">
        
        {/* Left Columns: Delivery Details & Payments */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Section 1: Address Details */}
          <div className="bg-white border border-coffee-100 p-6 rounded-2xl shadow-sm flex flex-col gap-5">
            <h3 className="text-base font-bold text-coffee-950 flex items-center gap-2">
              <FaMapMarkerAlt className="text-coffee-600" /> Delivery Details
            </h3>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-coffee-800">Contact Phone Number *</label>
              <div className="relative">
                <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-400" />
                <input
                  type="tel"
                  placeholder="+94 77 123 4567"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-2xl border border-coffee-200 bg-white py-3.5 pl-11 pr-4 text-xs text-coffee-950 focus:border-coffee-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-coffee-800">Delivery Address *</label>
              <textarea
                rows="3"
                placeholder="Flat / House No, Street name, City"
                required
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full rounded-2xl border border-coffee-200 bg-white p-4 text-xs text-coffee-950 focus:border-coffee-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div className="bg-white border border-coffee-100 p-6 rounded-2xl shadow-sm flex flex-col gap-5">
            <h3 className="text-base font-bold text-coffee-950 flex items-center gap-2">
              <FaCreditCard className="text-coffee-600" /> Payment Options
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* COD */}
              <label
                className={`flex items-center gap-4 rounded-2xl border p-5 cursor-pointer transition ${
                  paymentMethod === 'CASH_ON_DELIVERY'
                    ? 'border-coffee-600 bg-coffee-50/20'
                    : 'border-coffee-100 bg-white hover:bg-coffee-50/10'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CASH_ON_DELIVERY"
                  checked={paymentMethod === 'CASH_ON_DELIVERY'}
                  onChange={() => setPaymentMethod('CASH_ON_DELIVERY')}
                  className="accent-coffee-700 h-4 w-4"
                />
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-coffee-100 p-2.5 text-coffee-700">
                    <FaMoneyBillWave className="text-xl" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-coffee-950">Cash on Delivery</p>
                    <p className="text-[10px] text-coffee-500 mt-0.5">Pay with cash when order arrives.</p>
                  </div>
                </div>
              </label>

              {/* Online Payment */}
              <label
                className={`flex items-center gap-4 rounded-2xl border p-5 cursor-pointer transition ${
                  paymentMethod === 'ONLINE_CARD_PAYMENT'
                    ? 'border-coffee-600 bg-coffee-50/20'
                    : 'border-coffee-100 bg-white hover:bg-coffee-50/10'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="ONLINE_CARD_PAYMENT"
                  checked={paymentMethod === 'ONLINE_CARD_PAYMENT'}
                  onChange={() => setPaymentMethod('ONLINE_CARD_PAYMENT')}
                  className="accent-coffee-700 h-4 w-4"
                />
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-coffee-100 p-2.5 text-coffee-700">
                    <FaCreditCard className="text-xl" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-coffee-950">Credit / Debit Card</p>
                    <p className="text-[10px] text-coffee-500 mt-0.5">Pay online securely via Visa/Mastercard.</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* Right Column: Summary & Checkout button */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white border border-coffee-100 p-6 rounded-2xl shadow-sm flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-coffee-800 border-b border-coffee-100 pb-2">
              Order Breakdown
            </h3>
            
            <div className="flex flex-col gap-3 max-h-40 overflow-y-auto pr-1">
              {cart?.items?.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-xs text-coffee-700">
                  <span className="line-clamp-1 max-w-[150px]">
                    {item.product.name} <span className="font-bold">x {item.quantity}</span>
                  </span>
                  <span>LKR {(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <hr className="border-coffee-100" />

            <div className="flex justify-between text-xs text-coffee-700">
              <span>Items Subtotal</span>
              <span>LKR {subtotal.toFixed(2)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-xs text-green-700 font-medium">
                <span>Discount Code</span>
                <span>- LKR {discount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-xs text-coffee-700">
              <span>Delivery Fee</span>
              <span>LKR {deliveryFee.toFixed(2)}</span>
            </div>

            <hr className="border-coffee-100" />

            <div className="flex justify-between items-center text-coffee-950">
              <span className="text-xs font-bold">Total Payable</span>
              <span className="text-base font-extrabold text-coffee-900">LKR {payableAmount.toFixed(2)}</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-full bg-coffee-700 py-3.5 text-xs font-bold text-white shadow-md hover:bg-coffee-800 transition mt-4"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Placing Order...
                </span>
              ) : (
                'Place Order'
              )}
            </button>

            <div className="flex justify-center items-center gap-1.5 text-[10px] text-coffee-500 mt-2">
              <FaLock /> SSL Secure Payment Gateway
            </div>
          </div>
        </div>

      </form>
    </div>
  );
};
