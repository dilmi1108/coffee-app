import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { FaUser, FaHistory, FaHeart, FaAward, FaEdit, FaMapMarkerAlt, FaPhone, FaEnvelope, FaChevronRight } from 'react-icons/fa';
import api from '../api/axios';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';

export const Profile = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, fetchMe, updateProfile, loading: authLoading } = useAuthStore();
  const { addToCart } = useCartStore();

  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  // Edit profile states
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [updateMsg, setUpdateMsg] = useState('');
  const [updateError, setUpdateError] = useState('');

  useEffect(() => {
    fetchMe();
  }, []);

  useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditPhone(user.phone || '');
      setEditAddress(user.address || '');
    }
  }, [user]);

  // Read URL query parameter for active tab
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    } else if (activeTab === 'wishlist') {
      fetchWishlist();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await api.get('/api/orders');
      setOrders(res.data.sort((a, b) => b.id - a.id));
    } catch (err) {
      console.log('Error fetching orders');
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchWishlist = async () => {
    setLoadingWishlist(true);
    try {
      const res = await api.get('/api/wishlist');
      setWishlist(res.data);
    } catch (err) {
      console.log('Error fetching wishlist');
    } finally {
      setLoadingWishlist(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateMsg('');
    setUpdateError('');

    const res = await updateProfile({
      name: editName,
      phone: editPhone,
      address: editAddress
    });

    if (res.success) {
      setUpdateMsg('Profile updated successfully!');
      setIsEditing(false);
      fetchMe();
    } else {
      setUpdateError(res.error || 'Failed to update profile.');
    }
  };

  const handleRemoveWishlistItem = async (productId) => {
    try {
      await api.delete(`/api/wishlist/${productId}`);
      setWishlist(wishlist.filter(item => item.product.id !== productId));
    } catch (err) {
      console.log('Error removing wishlist item');
    }
  };

  const handleAddToCart = async (productId) => {
    await addToCart(productId, 1);
  };

  // Membership status helper
  const getMembershipStatus = (points) => {
    if (points >= 150) return { label: 'Gold Member', color: 'bg-amber-100 text-amber-800 border-amber-300' };
    if (points >= 50) return { label: 'Silver Member', color: 'bg-slate-100 text-slate-700 border-slate-300' };
    return { label: 'Bronze Member', color: 'bg-orange-100 text-orange-850 border-orange-200' };
  };

  const memberStatus = user ? getMembershipStatus(user.loyaltyPoints) : { label: 'Bronze', color: '' };

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: FaUser },
    { id: 'orders', label: 'Order History', icon: FaHistory },
    { id: 'wishlist', label: 'My Wishlist', icon: FaHeart },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-8 flex flex-col md:flex-row gap-10">
      
      {/* Sidebar Tabs */}
      <div className="w-full md:w-1/4 flex flex-col gap-6 text-left">
        
        {/* User Card */}
        {user && (
          <div className="bg-white border border-coffee-100 p-6 rounded-2xl shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-coffee-100 p-3.5 text-coffee-800 font-bold text-lg">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h4 className="font-display text-sm font-bold text-coffee-950">{user.name}</h4>
                <p className="text-[10px] text-coffee-500">{user.email}</p>
              </div>
            </div>

            <div className="border-t border-coffee-50 pt-4 flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-coffee-600 flex items-center gap-1.5"><FaAward /> Loyalty Points</span>
                <span className="font-extrabold text-coffee-950">{user.loyaltyPoints}</span>
              </div>
              <span className={`w-full rounded-full border text-center py-1 text-[10px] font-bold ${memberStatus.color}`}>
                {memberStatus.label}
              </span>
            </div>
          </div>
        )}

        {/* Tab Buttons */}
        <div className="flex flex-col gap-1.5">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left text-xs font-semibold transition ${
                  activeTab === tab.id
                    ? 'bg-coffee-700 text-white shadow-sm'
                    : 'bg-white border border-coffee-100/50 text-coffee-800 hover:bg-coffee-50'
                }`}
              >
                <TabIcon /> {tab.label}
              </button>
            );
          })}
        </div>

      </div>

      {/* Main Content Pane */}
      <div className="w-full md:w-3/4 text-left">
        
        {/* TAB 1: PROFILE INFO */}
        {activeTab === 'profile' && user && (
          <div className="bg-white border border-coffee-100 p-6 md:p-8 rounded-2xl shadow-sm flex flex-col gap-6">
            <div className="flex justify-between items-center border-b border-coffee-100 pb-4">
              <h2 className="font-display text-lg font-bold text-coffee-950">Profile Information</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 rounded-full border border-coffee-300 px-4 py-1.5 text-xs font-bold text-coffee-800 hover:bg-coffee-50 transition"
                >
                  <FaEdit /> Edit Profile
                </button>
              )}
            </div>

            {updateMsg && (
              <p className="rounded-xl bg-green-50 border border-green-150 p-4 text-xs font-semibold text-green-800">{updateMsg}</p>
            )}
            {updateError && (
              <p className="rounded-xl bg-red-50 border border-red-150 p-4 text-xs font-semibold text-red-800">{updateError}</p>
            )}

            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-coffee-500">Full Name</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="rounded-xl border border-coffee-200 bg-white px-4 py-2.5 text-xs text-coffee-950 focus:border-coffee-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-coffee-500">Phone Number</label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="rounded-xl border border-coffee-200 bg-white px-4 py-2.5 text-xs text-coffee-950 focus:border-coffee-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-coffee-500">Default Delivery Address</label>
                  <textarea
                    rows="3"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="rounded-xl border border-coffee-200 bg-white p-4 text-xs text-coffee-950 focus:border-coffee-500 focus:outline-none"
                  />
                </div>

                <div className="flex gap-4 mt-2">
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="rounded-full bg-coffee-700 px-6 py-2.5 text-xs font-bold text-white hover:bg-coffee-800 transition"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="rounded-full border border-coffee-300 px-6 py-2.5 text-xs font-bold text-coffee-800 hover:bg-coffee-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col gap-5 text-xs text-coffee-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-coffee-50 p-3 text-coffee-600"><FaUser /></div>
                    <div>
                      <p className="text-[10px] font-bold text-coffee-400 uppercase">Full Name</p>
                      <p className="font-semibold text-coffee-950 mt-0.5">{user.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-coffee-50 p-3 text-coffee-600"><FaEnvelope /></div>
                    <div>
                      <p className="text-[10px] font-bold text-coffee-400 uppercase">Email Address</p>
                      <p className="font-semibold text-coffee-950 mt-0.5">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-coffee-50 p-3 text-coffee-600"><FaPhone /></div>
                    <div>
                      <p className="text-[10px] font-bold text-coffee-400 uppercase">Phone Number</p>
                      <p className="font-semibold text-coffee-950 mt-0.5">{user.phone || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-coffee-50 p-3 text-coffee-600 mt-0.5"><FaMapMarkerAlt /></div>
                    <div>
                      <p className="text-[10px] font-bold text-coffee-400 uppercase">Default Delivery Address</p>
                      <p className="font-semibold text-coffee-950 mt-0.5 leading-relaxed">{user.address || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ORDER HISTORY */}
        {activeTab === 'orders' && (
          <div className="bg-white border border-coffee-100 p-6 md:p-8 rounded-2xl shadow-sm flex flex-col gap-6">
            <h2 className="font-display text-lg font-bold text-coffee-950 border-b border-coffee-100 pb-4">My Orders</h2>
            
            {loadingOrders ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-coffee-500 border-t-transparent"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 text-coffee-500 text-xs italic">
                You haven't placed any orders yet.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-coffee-50 p-5 rounded-2xl bg-coffee-50/10 text-left"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-coffee-950">Order #KK-{ord.id}</span>
                        <span className="font-mono text-[10px] font-bold text-coffee-600">({ord.trackingNumber})</span>
                      </div>
                      <p className="text-[10px] text-coffee-500 mt-1">
                        Placed on {new Date(ord.orderDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs font-extrabold text-coffee-900 mt-2">
                        LKR {ord.payableAmount.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 sm:ml-auto">
                      <span className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                        ord.status === 'DELIVERED'
                          ? 'bg-green-100 text-green-800'
                          : ord.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ord.status}
                      </span>
                      <Link
                        to={`/track/${ord.trackingNumber}`}
                        className="flex items-center gap-1 text-xs font-bold text-coffee-800 hover:text-coffee-600"
                      >
                        Track <FaChevronRight className="text-[10px]" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: WISHLIST */}
        {activeTab === 'wishlist' && (
          <div className="bg-white border border-coffee-100 p-6 md:p-8 rounded-2xl shadow-sm flex flex-col gap-6">
            <h2 className="font-display text-lg font-bold text-coffee-950 border-b border-coffee-100 pb-4">My Wishlist</h2>
            
            {loadingWishlist ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-coffee-500 border-t-transparent"></div>
              </div>
            ) : wishlist.length === 0 ? (
              <div className="text-center py-12 text-coffee-500 text-xs italic">
                Your wishlist is empty. Bookmark coffees on our menu!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {wishlist.map((item) => {
                  const product = item.product;
                  return (
                    <div
                      key={item.id}
                      className="group flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-coffee-50 shadow-sm text-left"
                    >
                      <div className="relative h-32 overflow-hidden bg-coffee-50">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                        <button
                          onClick={() => handleRemoveWishlistItem(product.id)}
                          className="absolute right-2 top-2 rounded-full bg-white/80 p-2 text-red-500 hover:bg-white shadow-sm"
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="flex flex-col gap-2 p-4 justify-between flex-grow">
                        <div>
                          <h5 className="text-xs font-bold text-coffee-950 line-clamp-1">{product.name}</h5>
                          <p className="text-[10px] text-coffee-600 line-clamp-1 mt-0.5">LKR {product.price.toFixed(2)}</p>
                        </div>
                        <button
                          onClick={() => handleAddToCart(product.id)}
                          disabled={product.stock <= 0}
                          className="w-full rounded-full bg-coffee-700 py-1.5 text-[10px] font-bold text-white hover:bg-coffee-800 transition text-center mt-2"
                        >
                          {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
