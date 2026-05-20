import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSearch, FaCoffee, FaTruck, FaCheckCircle, FaHourglassHalf, FaRegClock, FaMapMarkerAlt, FaAward } from 'react-icons/fa';
import api from '../api/axios';

export const OrderTracking = () => {
  const { trackingNumber } = useParams();
  const navigate = useNavigate();

  const [inputTracking, setInputTracking] = useState('');
  const [order, setOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (trackingNumber) {
      fetchOrder(trackingNumber);
    }
  }, [trackingNumber]);

  const fetchOrder = async (trackNo) => {
    setLoading(true);
    setErrorMsg('');
    setOrder(null);
    try {
      const res = await api.get(`/api/orders/tracking/${trackNo}`);
      setOrder(res.data);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Order not found. Please verify the tracking number.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputTracking.trim()) {
      navigate(`/track/${inputTracking.trim()}`);
    }
  };

  const getStatusStepIndex = (status) => {
    switch (status) {
      case 'PENDING': return 0;
      case 'PREPARING': return 1;
      case 'OUT_FOR_DELIVERY': return 2;
      case 'DELIVERED': return 3;
      default: return -1;
    }
  };

  const steps = [
    { title: 'Pending Approval', desc: 'Order received & waiting for prep desk check.', icon: FaHourglassHalf },
    { title: 'Preparing', desc: 'Our barista is grinding coffee & baking pastries.', icon: FaCoffee },
    { title: 'Out for Delivery', desc: 'Handed over to our delivery rider.', icon: FaTruck },
    { title: 'Delivered', desc: 'Fresh coffee & treats delivered at your door.', icon: FaCheckCircle }
  ];

  const currentStepIndex = order ? getStatusStepIndex(order.status) : -1;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 md:px-8 flex flex-col gap-10">
      
      {/* Page Header */}
      <div className="text-left border-b border-coffee-100 pb-6">
        <h1 className="font-display text-4xl font-extrabold text-coffee-950 font-sinhala">Track Your Order</h1>
        <p className="text-sm text-coffee-600 mt-2">Enter your unique tracking code to view live order progress.</p>
      </div>

      {/* Tracking Input Search */}
      <div className="bg-white border border-coffee-100 p-6 rounded-2xl shadow-sm text-left">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 w-full">
          <div className="relative flex-grow">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-400" />
            <input
              type="text"
              placeholder="e.g. KK-TRACK-123456"
              value={inputTracking}
              onChange={(e) => setInputTracking(e.target.value)}
              className="w-full rounded-2xl border border-coffee-200 bg-white py-3.5 pl-11 pr-4 text-xs text-coffee-950 focus:border-coffee-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-coffee-700 px-8 py-3.5 text-xs font-bold text-white hover:bg-coffee-800 transition shadow-md disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Track Status'}
          </button>
        </form>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="rounded-2xl bg-red-50 border border-red-150 p-5 text-xs font-medium text-red-800 text-left">
          {errorMsg}
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-coffee-500 border-t-transparent"></div>
        </div>
      )}

      {/* Order Status Display */}
      {order && (
        <div className="flex flex-col gap-8 text-left animate-fadeIn">
          
          {/* Order Summary Info Card */}
          <div className="rounded-2xl bg-white border border-coffee-100 p-6 shadow-sm flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-coffee-500 uppercase">Tracking Number</span>
              <p className="font-mono text-base font-extrabold text-coffee-900">{order.trackingNumber}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-coffee-500 uppercase">Placed Date</span>
              <p className="text-xs font-semibold text-coffee-800">
                {new Date(order.orderDate).toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-coffee-500 uppercase">Estimated Delivery</span>
              <p className="text-xs font-semibold text-coffee-800 flex items-center gap-1">
                <FaRegClock className="text-coffee-500" /> 30 - 45 Mins
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-coffee-500 uppercase">Total Price</span>
              <p className="text-xs font-extrabold text-coffee-950">LKR {order.payableAmount.toFixed(2)}</p>
            </div>
          </div>

          {/* Timeline Steps */}
          {order.status === 'CANCELLED' ? (
            <div className="rounded-2xl bg-red-50 border border-red-100 p-6 text-center text-xs text-red-800 font-bold">
              🚫 This order has been cancelled and refunded. If you believe this is an error, contact us.
            </div>
          ) : (
            <div className="bg-white border border-coffee-100 p-8 rounded-2xl shadow-sm flex flex-col gap-8">
              <h3 className="text-sm font-bold text-coffee-950">Live Preparation Progress</h3>
              
              <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative">
                {/* Connecting Line (for desktop) */}
                <div className="absolute top-6 left-6 right-6 h-0.5 bg-coffee-100 z-0 hidden md:block"></div>
                
                {steps.map((step, idx) => {
                  const StepIcon = step.icon;
                  const isCompleted = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  
                  return (
                    <div key={idx} className="flex md:flex-col items-start md:items-center gap-4 md:gap-3 flex-grow relative z-10">
                      
                      {/* Circle Icon Badge */}
                      <div
                        className={`rounded-full p-3.5 border-2 shadow-sm transition duration-300 ${
                          isCompleted
                            ? 'bg-coffee-700 border-coffee-800 text-white'
                            : 'bg-white border-coffee-100 text-coffee-300'
                        } ${isCurrent ? 'ring-4 ring-coffee-500/25 animate-pulse' : ''}`}
                      >
                        <StepIcon className="text-lg" />
                      </div>

                      {/* Details */}
                      <div className="flex flex-col md:items-center text-left md:text-center max-w-[180px]">
                        <h5
                          className={`text-xs font-bold ${
                            isCompleted ? 'text-coffee-950' : 'text-coffee-400'
                          }`}
                        >
                          {step.title}
                        </h5>
                        <p className="text-[10px] text-coffee-500 leading-relaxed mt-1">{step.desc}</p>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Details Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Items */}
            <div className="bg-white border border-coffee-100 p-6 rounded-2xl shadow-sm flex flex-col gap-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-coffee-800 border-b border-coffee-100 pb-2">
                Order Items
              </h4>
              <div className="flex flex-col gap-3">
                {order.items?.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-xs">
                    <span className="text-coffee-850">
                      {item.product.name} <span className="font-bold text-coffee-500">x {item.quantity}</span>
                    </span>
                    <span className="font-semibold text-coffee-950">
                      LKR {(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery address & loyalty */}
            <div className="bg-white border border-coffee-100 p-6 rounded-2xl shadow-sm flex flex-col gap-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-coffee-800 border-b border-coffee-100 pb-2">
                Delivery Address
              </h4>
              <p className="text-xs text-coffee-850 flex items-start gap-1.5 leading-relaxed">
                <FaMapMarkerAlt className="text-coffee-600 mt-0.5 shrink-0" />
                <span>{order.deliveryAddress}</span>
              </p>
              
              {order.loyaltyPointsEarned > 0 && (
                <div className="mt-auto rounded-xl bg-green-50/50 border border-green-150 p-4 flex items-center gap-3">
                  <FaAward className="text-2xl text-green-700" />
                  <div>
                    <h5 className="text-xs font-bold text-green-950">Loyalty Points Earned</h5>
                    <p className="text-[10px] text-green-700">+{order.loyaltyPointsEarned} points added to account</p>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
