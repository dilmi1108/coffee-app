import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaCoffee, FaShieldAlt, FaChartBar, FaBoxes, FaTags, FaShoppingBag, 
  FaTicketAlt, FaBookOpen, FaCommentDots, FaUsers, FaEdit, FaTrash, 
  FaPlus, FaCheck, FaBan, FaToggleOn, FaToggleOff 
} from 'react-icons/fa';
import api from '../../api/axios';
import { useAuthStore } from '../../store/useAuthStore';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('analytics');

  // Backend analytical stats state
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    lowStockCount: 0,
    popularProducts: [],
    salesChart: {}
  });
  const [loadingStats, setLoadingStats] = useState(false);

  // Entities states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);

  // Form modals control
  const [showProductModal, setShowProductModal] = useState(false);
  const [productForm, setProductForm] = useState({
    id: null, name: '', description: '', price: '', imageUrl: '', 
    stock: '', ingredients: '', loyaltyPointsReward: '', isFeatured: false, categoryId: ''
  });

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ id: null, name: '', description: '', imageUrl: '' });

  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponForm, setCouponForm] = useState({ id: null, code: '', discountPercent: '', maxDiscount: '', expiryDate: '', active: true });

  const [showBlogModal, setShowBlogModal] = useState(false);
  const [blogForm, setBlogForm] = useState({ id: null, title: '', content: '', author: '', category: '', imageUrl: '' });

  useEffect(() => {
    fetchStats();
    loadTabContent();
  }, [activeTab]);

  const loadTabContent = () => {
    switch (activeTab) {
      case 'products': fetchProducts(); fetchCategories(); break;
      case 'categories': fetchCategories(); break;
      case 'orders': fetchOrders(); break;
      case 'coupons': fetchCoupons(); break;
      case 'blogs': fetchBlogs(); break;
      case 'reviews': fetchReviews(); break;
      case 'users': fetchUsers(); break;
      default: fetchStats();
    }
  };

  // --- API CALLS ---

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await api.get('/api/admin/analytics');
      setStats(res.data);
    } catch (err) {
      console.log('Error fetching stats');
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get('/api/products/all');
      setProducts(res.data);
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

  const fetchOrders = async () => {
    try {
      const res = await api.get('/api/orders/admin/all');
      setOrders(res.data.sort((a, b) => b.id - a.id));
    } catch (err) {
      console.log('Error fetching orders');
    }
  };

  const fetchCoupons = async () => {
    try {
      const res = await api.get('/api/coupons');
      setCoupons(res.data);
    } catch (err) {
      console.log('Error fetching coupons');
    }
  };

  const fetchBlogs = async () => {
    try {
      const res = await api.get('/api/blogs');
      setBlogs(res.data);
    } catch (err) {
      console.log('Error fetching blogs');
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await api.get('/api/reviews/admin/all');
      setReviews(res.data);
    } catch (err) {
      console.log('Error fetching reviews');
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/api/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.log('Error fetching users');
    }
  };

  // --- CRUD ACTIONS ---

  // Products
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const pData = {
        name: productForm.name,
        description: productForm.description,
        price: Number(productForm.price),
        imageUrl: productForm.imageUrl,
        stock: Number(productForm.stock),
        ingredients: productForm.ingredients,
        loyaltyPointsReward: Number(productForm.loyaltyPointsReward),
        isFeatured: productForm.isFeatured,
        active: true
      };

      if (productForm.id) {
        await api.put(`/api/products/${productForm.id}?categoryId=${productForm.categoryId}`, pData);
      } else {
        await api.post(`/api/products?categoryId=${productForm.categoryId}`, pData);
      }
      setShowProductModal(false);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving product');
    }
  };

  const handleEditProduct = (prod) => {
    setProductForm({
      id: prod.id, name: prod.name, description: prod.description, price: prod.price, 
      imageUrl: prod.imageUrl, stock: prod.stock, ingredients: prod.ingredients || '', 
      loyaltyPointsReward: prod.loyaltyPointsReward || 0, isFeatured: prod.isFeatured, categoryId: prod.category?.id || ''
    });
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Delete this product permanently?')) {
      try {
        await api.delete(`/api/products/${id}`);
        fetchProducts();
      } catch (err) {
        alert('Could not delete product.');
      }
    }
  };

  // Categories
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      if (categoryForm.id) {
        await api.put(`/api/categories/${categoryForm.id}`, categoryForm);
      } else {
        await api.post('/api/categories', categoryForm);
      }
      setShowCategoryModal(false);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving category');
    }
  };

  const handleEditCategory = (cat) => {
    setCategoryForm({ id: cat.id, name: cat.name, description: cat.description, imageUrl: cat.imageUrl });
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Delete this category permanently?')) {
      try {
        await api.delete(`/api/categories/${id}`);
        fetchCategories();
      } catch (err) {
        alert('Could not delete category.');
      }
    }
  };

  // Orders
  const handleUpdateOrderStatus = async (id, status) => {
    try {
      await api.put(`/api/orders/admin/${id}/status?status=${status}`);
      fetchOrders();
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  // Coupons
  const handleSaveCoupon = async (e) => {
    e.preventDefault();
    try {
      const cData = {
        code: couponForm.code,
        discountPercent: Number(couponForm.discountPercent),
        maxDiscount: Number(couponForm.maxDiscount),
        expiryDate: new Date(couponForm.expiryDate).toISOString(),
        active: couponForm.active
      };
      if (couponForm.id) {
        await api.put(`/api/coupons/${couponForm.id}`, cData);
      } else {
        await api.post('/api/coupons', cData);
      }
      setShowCouponModal(false);
      fetchCoupons();
    } catch (err) {
      alert('Error saving coupon');
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (window.confirm('Delete this coupon?')) {
      try {
        await api.delete(`/api/coupons/${id}`);
        fetchCoupons();
      } catch (err) {
        alert('Could not delete coupon.');
      }
    }
  };

  // Blogs
  const handleSaveBlog = async (e) => {
    e.preventDefault();
    try {
      if (blogForm.id) {
        await api.put(`/api/blogs/${blogForm.id}`, blogForm);
      } else {
        await api.post('/api/blogs', blogForm);
      }
      setShowBlogModal(false);
      fetchBlogs();
    } catch (err) {
      alert('Error saving blog');
    }
  };

  const handleDeleteBlog = async (id) => {
    if (window.confirm('Delete this blog post?')) {
      try {
        await api.delete(`/api/blogs/${id}`);
        fetchBlogs();
      } catch (err) {
        alert('Could not delete blog.');
      }
    }
  };

  // Reviews
  const handleApproveReview = async (id) => {
    try {
      await api.put(`/api/reviews/admin/${id}/approve`);
      fetchReviews();
    } catch (err) {
      alert('Failed to approve review.');
    }
  };

  const handleDeleteReview = async (id) => {
    if (window.confirm('Delete this review permanently?')) {
      try {
        await api.delete(`/api/reviews/admin/${id}`);
        fetchReviews();
      } catch (err) {
        alert('Failed to delete review.');
      }
    }
  };

  // Users
  const handleToggleUserStatus = async (id) => {
    try {
      await api.put(`/api/admin/users/${id}/status`);
      fetchUsers();
    } catch (err) {
      alert('Failed to update user status.');
    }
  };

  const handlePromoteRole = async (id, currentRole) => {
    const nextRole = currentRole === 'ROLE_ADMIN' ? 'ROLE_CUSTOMER' : 'ROLE_ADMIN';
    if (window.confirm(`Change this user's role to ${nextRole}?`)) {
      try {
        await api.put(`/api/admin/users/${id}/role?role=${nextRole}`);
        fetchUsers();
      } catch (err) {
        alert('Failed to promote user.');
      }
    }
  };

  const sidebarItems = [
    { id: 'analytics', label: 'Analytics & Sales', icon: FaChartBar },
    { id: 'products', label: 'Products Management', icon: FaBoxes },
    { id: 'categories', label: 'Categories Management', icon: FaTags },
    { id: 'orders', label: 'Orders Console', icon: FaShoppingBag },
    { id: 'coupons', label: 'Promo Coupons', icon: FaTicketAlt },
    { id: 'blogs', label: 'Articles & Recipes', icon: FaBookOpen },
    { id: 'reviews', label: 'Reviews Moderation', icon: FaCommentDots },
    { id: 'users', label: 'Users & Permissions', icon: FaUsers },
  ];

  return (
    <div className="flex min-h-screen bg-coffee-50/20 text-coffee-950 font-sans text-left">
      
      {/* 1. LEFT PANEL SIDEBAR */}
      <aside className="w-64 bg-coffee-950 text-coffee-100 flex flex-col justify-between shrink-0 p-5 border-r border-coffee-900 shadow-md">
        <div className="flex flex-col gap-8">
          
          {/* Dashboard Title */}
          <div className="flex items-center gap-2 border-b border-coffee-900 pb-5">
            <FaShieldAlt className="text-2xl text-coffee-400" />
            <div>
              <h1 className="text-sm font-extrabold uppercase tracking-widest text-white">කෝපි කඩේ</h1>
              <p className="text-[10px] text-coffee-400">Admin Console</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            {sidebarItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold transition ${
                    activeTab === item.id
                      ? 'bg-coffee-700 text-white shadow-sm'
                      : 'text-coffee-300 hover:bg-coffee-900 hover:text-white'
                  }`}
                >
                  <Icon /> {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col gap-2.5 border-t border-coffee-900 pt-5">
          <button
            onClick={() => navigate('/')}
            className="w-full text-center rounded-xl border border-coffee-800 py-2.5 text-[11px] font-bold text-coffee-300 hover:bg-coffee-900 hover:text-white"
          >
            Visit Shop Page
          </button>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="w-full text-center rounded-xl bg-red-650 py-2.5 text-[11px] font-bold text-white hover:bg-red-700"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* 2. MAIN BODY CONTENT */}
      <main className="flex-grow p-8 overflow-y-auto max-h-screen">
        
        {/* TAB 1: ANALYTICS OVERVIEW */}
        {activeTab === 'analytics' && (
          <div className="flex flex-col gap-8">
            <h2 className="text-xl font-bold text-coffee-950">Analytics Dashboard</h2>
            
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white border border-coffee-100 p-5 rounded-2xl shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-coffee-500">Gross Revenue</span>
                <p className="text-xl font-extrabold text-coffee-950 mt-1">LKR {stats.totalRevenue?.toFixed(2)}</p>
              </div>
              <div className="bg-white border border-coffee-100 p-5 rounded-2xl shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-coffee-500">Orders Processed</span>
                <p className="text-xl font-extrabold text-coffee-950 mt-1">{stats.totalOrders}</p>
              </div>
              <div className="bg-white border border-coffee-100 p-5 rounded-2xl shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-coffee-500">Registered Customers</span>
                <p className="text-xl font-extrabold text-coffee-950 mt-1">{stats.totalCustomers}</p>
              </div>
              <div className="bg-white border border-coffee-100 p-5 rounded-2xl shadow-sm border-l-4 border-l-red-500">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-700">Low Stock Alerts</span>
                <p className="text-xl font-extrabold text-red-800 mt-1">{stats.lowStockCount}</p>
              </div>
            </div>

            {/* Sales Chart & Top Selling Items */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Sales Chart Bar Representation */}
              <div className="lg:col-span-2 bg-white border border-coffee-100 p-6 rounded-2xl shadow-sm flex flex-col gap-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-coffee-800 border-b border-coffee-100 pb-2">
                  Last 7 Days Revenue
                </h3>
                {/* Horizontal simple CSS grid representation */}
                <div className="flex justify-between items-end h-56 pt-6 px-4">
                  {Object.entries(stats.salesChart || {}).map(([day, val]) => (
                    <div key={day} className="flex flex-col items-center gap-2 flex-grow">
                      <div className="text-[9px] font-bold text-coffee-600">LKR {val}</div>
                      <div
                        className="w-8 bg-coffee-700 hover:bg-coffee-650 rounded-t-md transition-all duration-550"
                        style={{ height: `${Math.min(150, Math.max(8, val / 150))}px` }}
                      ></div>
                      <span className="text-[10px] font-bold text-coffee-700">{day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Selling Products */}
              <div className="lg:col-span-1 bg-white border border-coffee-100 p-6 rounded-2xl shadow-sm flex flex-col gap-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-coffee-800 border-b border-coffee-100 pb-2">
                  Best Coffee Sellers
                </h3>
                <div className="flex flex-col gap-3">
                  {stats.popularProducts?.length === 0 ? (
                    <p className="text-xs text-coffee-500 italic py-6">Waiting for sales records.</p>
                  ) : (
                    stats.popularProducts?.map((prod, idx) => (
                      <div key={idx} className="flex items-center gap-3 border-b border-coffee-50 pb-2 text-xs">
                        <img src={prod.imageUrl} className="w-8 h-8 rounded-md object-cover" />
                        <div className="flex-grow">
                          <p className="font-bold text-coffee-950 line-clamp-1">{prod.name}</p>
                          <p className="text-[10px] text-coffee-500">{prod.salesCount} sold</p>
                        </div>
                        <span className="font-semibold text-coffee-900">LKR {prod.revenue}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center border-b border-coffee-100 pb-4">
              <h2 className="text-xl font-bold text-coffee-950">Products Inventory</h2>
              <button
                onClick={() => {
                  setProductForm({
                    id: null, name: '', description: '', price: '', imageUrl: '', 
                    stock: '', ingredients: '', loyaltyPointsReward: 0, isFeatured: false, categoryId: categories[0]?.id || ''
                  });
                  setShowProductModal(true);
                }}
                className="flex items-center gap-1.5 rounded-xl bg-coffee-700 px-4 py-2 text-xs font-bold text-white hover:bg-coffee-800 transition shadow-sm"
              >
                <FaPlus /> Add New Product
              </button>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto rounded-2xl border border-coffee-100 bg-white shadow-sm">
              <table className="w-full text-xs text-left">
                <thead className="bg-coffee-50 text-[10px] font-bold uppercase tracking-wider text-coffee-800">
                  <tr>
                    <th className="p-4">Image</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Featured</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-coffee-50">
                  {products.map(prod => (
                    <tr key={prod.id} className="hover:bg-coffee-50/30">
                      <td className="p-4">
                        <img src={prod.imageUrl} className="h-10 w-10 rounded-lg object-cover border" />
                      </td>
                      <td className="p-4 font-bold text-coffee-950">{prod.name}</td>
                      <td className="p-4">{prod.category?.name}</td>
                      <td className="p-4">LKR {prod.price}</td>
                      <td className="p-4 font-semibold">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] ${
                          prod.stock <= 5 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {prod.stock} items
                        </span>
                      </td>
                      <td className="p-4">{prod.isFeatured ? 'Yes' : 'No'}</td>
                      <td className="p-4 text-right flex gap-2 justify-end">
                        <button onClick={() => handleEditProduct(prod)} className="rounded-md border p-2 text-coffee-700 hover:bg-coffee-50">
                          <FaEdit />
                        </button>
                        <button onClick={() => handleDeleteProduct(prod.id)} className="rounded-md border p-2 text-red-500 hover:bg-red-50">
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CATEGORIES MANAGEMENT */}
        {activeTab === 'categories' && (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center border-b border-coffee-100 pb-4">
              <h2 className="text-xl font-bold text-coffee-950">Categories Directory</h2>
              <button
                onClick={() => {
                  setCategoryForm({ id: null, name: '', description: '', imageUrl: '' });
                  setShowCategoryModal(true);
                }}
                className="flex items-center gap-1.5 rounded-xl bg-coffee-700 px-4 py-2 text-xs font-bold text-white hover:bg-coffee-800 transition shadow-sm"
              >
                <FaPlus /> Add New Category
              </button>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {categories.map(cat => (
                <div key={cat.id} className="bg-white border border-coffee-100 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
                  <div className="h-32 bg-coffee-50 relative">
                    <img src={cat.imageUrl} className="h-full w-full object-cover" />
                  </div>
                  <div className="p-5 flex flex-col gap-2">
                    <h4 className="font-bold text-sm text-coffee-950">{cat.name}</h4>
                    <p className="text-[11px] text-coffee-600 leading-relaxed line-clamp-2">{cat.description}</p>
                    <div className="flex gap-2 justify-end border-t border-coffee-50 pt-3.5 mt-3">
                      <button onClick={() => handleEditCategory(cat)} className="rounded-md border px-3 py-1.5 text-[11px] font-bold text-coffee-700 hover:bg-coffee-50 flex items-center gap-1">
                        <FaEdit /> Edit
                      </button>
                      <button onClick={() => handleDeleteCategory(cat.id)} className="rounded-md border px-3 py-1.5 text-[11px] font-bold text-red-500 hover:bg-red-50 flex items-center gap-1">
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ORDERS MANAGEMENT CONSOLE */}
        {activeTab === 'orders' && (
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold text-coffee-950 border-b border-coffee-100 pb-4">Live Orders Console</h2>
            
            <div className="overflow-x-auto rounded-2xl border border-coffee-100 bg-white shadow-sm">
              <table className="w-full text-xs text-left">
                <thead className="bg-coffee-50 text-[10px] font-bold uppercase tracking-wider text-coffee-800">
                  <tr>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Payable Amount</th>
                    <th className="p-4">Tracking Code</th>
                    <th className="p-4">Current Status</th>
                    <th className="p-4 text-right">Process Stage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-coffee-50">
                  {orders.map(ord => (
                    <tr key={ord.id} className="hover:bg-coffee-50/30">
                      <td className="p-4 font-bold">#KK-{ord.id}</td>
                      <td className="p-4">
                        <p className="font-bold text-coffee-950">{ord.user?.name}</p>
                        <p className="text-[10px] text-coffee-500">{ord.phone}</p>
                      </td>
                      <td className="p-4 font-semibold">LKR {ord.payableAmount.toFixed(2)}</td>
                      <td className="p-4 font-mono font-bold text-coffee-600">{ord.trackingNumber}</td>
                      <td className="p-4">
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          ord.status === 'DELIVERED'
                            ? 'bg-green-100 text-green-800'
                            : ord.status === 'CANCELLED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {ord.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {ord.status !== 'DELIVERED' && ord.status !== 'CANCELLED' && (
                          <div className="flex gap-1 justify-end">
                            {ord.status === 'PENDING' && (
                              <button onClick={() => handleUpdateOrderStatus(ord.id, 'PREPARING')} className="bg-amber-600 hover:bg-amber-700 text-white rounded px-2.5 py-1 font-bold text-[10px]">
                                Prepare
                              </button>
                            )}
                            {ord.status === 'PREPARING' && (
                              <button onClick={() => handleUpdateOrderStatus(ord.id, 'OUT_FOR_DELIVERY')} className="bg-blue-600 hover:bg-blue-700 text-white rounded px-2.5 py-1 font-bold text-[10px]">
                                Dispatch
                              </button>
                            )}
                            {ord.status === 'OUT_FOR_DELIVERY' && (
                              <button onClick={() => handleUpdateOrderStatus(ord.id, 'DELIVERED')} className="bg-green-600 hover:bg-green-700 text-white rounded px-2.5 py-1 font-bold text-[10px]">
                                Complete
                              </button>
                            )}
                            <button onClick={() => handleUpdateOrderStatus(ord.id, 'CANCELLED')} className="bg-red-500 hover:bg-red-650 text-white rounded px-2.5 py-1 font-bold text-[10px]">
                              Cancel
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: COUPONS */}
        {activeTab === 'coupons' && (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center border-b border-coffee-100 pb-4">
              <h2 className="text-xl font-bold text-coffee-950">Promo Coupons</h2>
              <button
                onClick={() => {
                  setCouponForm({ id: null, code: '', discountPercent: '', maxDiscount: '', expiryDate: '', active: true });
                  setShowCouponModal(true);
                }}
                className="flex items-center gap-1.5 rounded-xl bg-coffee-700 px-4 py-2 text-xs font-bold text-white hover:bg-coffee-800 transition shadow-sm"
              >
                <FaPlus /> Add Promo Code
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-coffee-100 bg-white shadow-sm">
              <table className="w-full text-xs text-left">
                <thead className="bg-coffee-50 text-[10px] font-bold uppercase tracking-wider text-coffee-800">
                  <tr>
                    <th className="p-4">Code</th>
                    <th className="p-4">Discount</th>
                    <th className="p-4">Max Cap</th>
                    <th className="p-4">Expiry Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-coffee-50">
                  {coupons.map(c => (
                    <tr key={c.id}>
                      <td className="p-4 font-mono font-bold text-coffee-950">{c.code}</td>
                      <td className="p-4">{c.discountPercent}%</td>
                      <td className="p-4">LKR {c.maxDiscount}</td>
                      <td className="p-4">{new Date(c.expiryDate).toLocaleDateString()}</td>
                      <td className="p-4">
                        <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                          c.active ? 'bg-green-150 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {c.active ? 'Active' : 'Expired'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => handleDeleteCoupon(c.id)} className="text-red-500 hover:text-red-700 p-2 border rounded-md">
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: BLOGS */}
        {activeTab === 'blogs' && (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center border-b border-coffee-100 pb-4">
              <h2 className="text-xl font-bold text-coffee-950">Blogs Management</h2>
              <button
                onClick={() => {
                  setBlogForm({ id: null, title: '', content: '', author: '', category: 'BREWING_TIPS', imageUrl: '' });
                  setShowBlogModal(true);
                }}
                className="flex items-center gap-1.5 rounded-xl bg-coffee-700 px-4 py-2 text-xs font-bold text-white hover:bg-coffee-800 transition shadow-sm"
              >
                <FaPlus /> New Article
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {blogs.map(b => (
                <div key={b.id} className="bg-white border border-coffee-100 p-5 rounded-2xl flex gap-4 text-xs">
                  <img src={b.imageUrl} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-coffee-950 line-clamp-1">{b.title}</h4>
                      <p className="text-[10px] text-coffee-500 mt-1">Author: {b.author}</p>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => {
                        setBlogForm({ id: b.id, title: b.title, content: b.content, author: b.author, category: b.category, imageUrl: b.imageUrl });
                        setShowBlogModal(true);
                      }} className="text-coffee-700 hover:text-coffee-900 px-2.5 py-1 border rounded-md">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteBlog(b.id)} className="text-red-500 hover:text-red-700 px-2.5 py-1 border rounded-md">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold text-coffee-950 border-b border-coffee-100 pb-4">Customer Reviews Moderation</h2>
            
            <div className="overflow-x-auto rounded-2xl border border-coffee-100 bg-white shadow-sm">
              <table className="w-full text-xs text-left">
                <thead className="bg-coffee-50 text-[10px] font-bold uppercase tracking-wider text-coffee-800">
                  <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Rating</th>
                    <th className="p-4">Comment</th>
                    <th className="p-4">Approved</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-coffee-50">
                  {reviews.map(rev => (
                    <tr key={rev.id}>
                      <td className="p-4 font-bold">{rev.productName}</td>
                      <td className="p-4">{rev.userName}</td>
                      <td className="p-4">⭐ {rev.rating}/5</td>
                      <td className="p-4 italic max-w-xs line-clamp-2">{rev.comment}</td>
                      <td className="p-4">{rev.approved ? 'Yes' : 'Pending'}</td>
                      <td className="p-4 text-right flex gap-1 justify-end">
                        {!rev.approved && (
                          <button onClick={() => handleApproveReview(rev.id)} className="rounded bg-green-600 hover:bg-green-700 text-white p-1.5 text-[10px]">
                            <FaCheck />
                          </button>
                        )}
                        <button onClick={() => handleDeleteReview(rev.id)} className="rounded border p-1.5 text-red-500 hover:bg-red-50">
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 8: USERS */}
        {activeTab === 'users' && (
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold text-coffee-950 border-b border-coffee-100 pb-4">Users & Permissions</h2>
            
            <div className="overflow-x-auto rounded-2xl border border-coffee-100 bg-white shadow-sm">
              <table className="w-full text-xs text-left">
                <thead className="bg-coffee-50 text-[10px] font-bold uppercase tracking-wider text-coffee-800">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-coffee-50">
                  {users.map(u => (
                    <tr key={u.id}>
                      <td className="p-4 font-bold text-coffee-950">{u.name}</td>
                      <td className="p-4">{u.email}</td>
                      <td className="p-4">{u.phone || 'N/A'}</td>
                      <td className="p-4 font-semibold text-coffee-700">{u.role}</td>
                      <td className="p-4">
                        <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold ${
                          u.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {u.active ? 'Active' : 'Blocked'}
                        </span>
                      </td>
                      <td className="p-4 text-right flex gap-2 justify-end">
                        <button onClick={() => handlePromoteRole(u.id, u.role)} className="border rounded-md px-2 py-1 hover:bg-coffee-55">
                          Change Role
                        </button>
                        <button onClick={() => handleToggleUserStatus(u.id)} className="border rounded-md p-1 hover:bg-coffee-55 text-coffee-700">
                          {u.active ? <FaBan className="text-red-500" /> : <FaCheck className="text-green-600" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* --- FORMS MODALS OVERLAYS --- */}

      {/* Product Form Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <form onSubmit={handleSaveProduct} className="bg-white rounded-3xl p-6 w-full max-w-lg flex flex-col gap-4 text-xs">
            <h3 className="text-sm font-bold text-coffee-950">{productForm.id ? 'Edit Product' : 'Add Product'}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label>Name</label>
                <input type="text" required value={productForm.name} onChange={(e) => setProductForm({...productForm, name: e.target.value})} className="border rounded px-3 py-2" />
              </div>
              <div className="flex flex-col gap-1">
                <label>Price (LKR)</label>
                <input type="number" required value={productForm.price} onChange={(e) => setProductForm({...productForm, price: e.target.value})} className="border rounded px-3 py-2" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label>Category</label>
                <select value={productForm.categoryId} onChange={(e) => setProductForm({...productForm, categoryId: e.target.value})} className="border rounded px-3 py-2 bg-white">
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label>Stock Quantity</label>
                <input type="number" required value={productForm.stock} onChange={(e) => setProductForm({...productForm, stock: e.target.value})} className="border rounded px-3 py-2" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label>Image URL</label>
              <input type="text" required value={productForm.imageUrl} onChange={(e) => setProductForm({...productForm, imageUrl: e.target.value})} className="border rounded px-3 py-2" />
            </div>
            <div className="flex flex-col gap-1">
              <label>Ingredients (comma separated)</label>
              <input type="text" value={productForm.ingredients} onChange={(e) => setProductForm({...productForm, ingredients: e.target.value})} className="border rounded px-3 py-2" />
            </div>
            <div className="grid grid-cols-2 gap-4 items-center">
              <div className="flex flex-col gap-1">
                <label>Loyalty Reward Points</label>
                <input type="number" value={productForm.loyaltyPointsReward} onChange={(e) => setProductForm({...productForm, loyaltyPointsReward: e.target.value})} className="border rounded px-3 py-2" />
              </div>
              <label className="flex items-center gap-2 mt-4 cursor-pointer font-bold">
                <input type="checkbox" checked={productForm.isFeatured} onChange={(e) => setProductForm({...productForm, isFeatured: e.target.checked})} className="h-4 w-4" />
                Featured Item
              </label>
            </div>
            <div className="flex flex-col gap-1">
              <label>Description</label>
              <textarea rows="2" value={productForm.description} onChange={(e) => setProductForm({...productForm, description: e.target.value})} className="border rounded p-3" />
            </div>
            <div className="flex gap-3 justify-end mt-4">
              <button type="submit" className="bg-coffee-700 text-white rounded-full px-5 py-2 font-bold">Save</button>
              <button type="button" onClick={() => setShowProductModal(false)} className="border rounded-full px-5 py-2 font-bold text-coffee-800">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Category Form Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <form onSubmit={handleSaveCategory} className="bg-white rounded-3xl p-6 w-full max-w-md flex flex-col gap-4 text-xs">
            <h3 className="text-sm font-bold text-coffee-950">{categoryForm.id ? 'Edit Category' : 'Create Category'}</h3>
            <div className="flex flex-col gap-1">
              <label>Category Name</label>
              <input type="text" required value={categoryForm.name} onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})} className="border rounded px-3 py-2" />
            </div>
            <div className="flex flex-col gap-1">
              <label>Image URL</label>
              <input type="text" required value={categoryForm.imageUrl} onChange={(e) => setCategoryForm({...categoryForm, imageUrl: e.target.value})} className="border rounded px-3 py-2" />
            </div>
            <div className="flex flex-col gap-1">
              <label>Description</label>
              <textarea rows="3" value={categoryForm.description} onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})} className="border rounded p-3" />
            </div>
            <div className="flex gap-3 justify-end mt-4">
              <button type="submit" className="bg-coffee-700 text-white rounded-full px-5 py-2 font-bold">Save</button>
              <button type="button" onClick={() => setShowCategoryModal(false)} className="border rounded-full px-5 py-2 font-bold text-coffee-800">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Coupon Form Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <form onSubmit={handleSaveCoupon} className="bg-white rounded-3xl p-6 w-full max-w-md flex flex-col gap-4 text-xs">
            <h3 className="text-sm font-bold text-coffee-950">Add Promo Code</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label>Code (Caps)</label>
                <input type="text" required value={couponForm.code} onChange={(e) => setCouponForm({...couponForm, code: e.target.value.toUpperCase()})} className="border rounded px-3 py-2" />
              </div>
              <div className="flex flex-col gap-1">
                <label>Discount Percent</label>
                <input type="number" required value={couponForm.discountPercent} onChange={(e) => setCouponForm({...couponForm, discountPercent: e.target.value})} className="border rounded px-3 py-2" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 font-bold">
              <div className="flex flex-col gap-1">
                <label>Max Cap (LKR)</label>
                <input type="number" required value={couponForm.maxDiscount} onChange={(e) => setCouponForm({...couponForm, maxDiscount: e.target.value})} className="border rounded px-3 py-2" />
              </div>
              <div className="flex flex-col gap-1">
                <label>Expiry Date</label>
                <input type="date" required value={couponForm.expiryDate} onChange={(e) => setCouponForm({...couponForm, expiryDate: e.target.value})} className="border rounded px-3 py-2" />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-4">
              <button type="submit" className="bg-coffee-700 text-white rounded-full px-5 py-2 font-bold">Save</button>
              <button type="button" onClick={() => setShowCouponModal(false)} className="border rounded-full px-5 py-2 font-bold text-coffee-800">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Blog Form Modal */}
      {showBlogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <form onSubmit={handleSaveBlog} className="bg-white rounded-3xl p-6 w-full max-w-lg flex flex-col gap-4 text-xs">
            <h3 className="text-sm font-bold text-coffee-950">Add Blog Post</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label>Title</label>
                <input type="text" required value={blogForm.title} onChange={(e) => setBlogForm({...blogForm, title: e.target.value})} className="border rounded px-3 py-2" />
              </div>
              <div className="flex flex-col gap-1">
                <label>Author</label>
                <input type="text" required value={blogForm.author} onChange={(e) => setBlogForm({...blogForm, author: e.target.value})} className="border rounded px-3 py-2" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label>Category</label>
                <select value={blogForm.category} onChange={(e) => setBlogForm({...blogForm, category: e.target.value})} className="border rounded px-3 py-2 bg-white">
                  <option value="BREWING_TIPS">Brewing Tips</option>
                  <option value="COFFEE_NEWS">Coffee News</option>
                  <option value="RECIPES">Recipes</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label>Image URL</label>
                <input type="text" required value={blogForm.imageUrl} onChange={(e) => setBlogForm({...blogForm, imageUrl: e.target.value})} className="border rounded px-3 py-2" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label>Article Content</label>
              <textarea rows="5" required value={blogForm.content} onChange={(e) => setBlogForm({...blogForm, content: e.target.value})} className="border rounded p-3" />
            </div>
            <div className="flex gap-3 justify-end mt-4">
              <button type="submit" className="bg-coffee-700 text-white rounded-full px-5 py-2 font-bold">Save</button>
              <button type="button" onClick={() => setShowBlogModal(false)} className="border rounded-full px-5 py-2 font-bold text-coffee-800">Cancel</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
