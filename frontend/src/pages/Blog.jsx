import React, { useEffect, useState } from 'react';
import { FaSearch, FaUser, FaTag, FaCalendarAlt, FaTimes } from 'react-icons/fa';
import api from '../api/axios';

export const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    let result = blogs;

    if (searchQuery.trim()) {
      result = result.filter(b => 
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        b.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'ALL') {
      result = result.filter(b => b.category === selectedCategory);
    }

    setFilteredBlogs(result);
  }, [searchQuery, selectedCategory, blogs]);

  const fetchBlogs = async () => {
    try {
      const res = await api.get('/api/blogs');
      setBlogs(res.data);
      setFilteredBlogs(res.data);
    } catch (err) {
      console.log('Error fetching blogs');
    }
  };

  const categories = [
    { code: 'ALL', label: 'All Articles' },
    { code: 'BREWING_TIPS', label: 'Brewing Tips' },
    { code: 'COFFEE_NEWS', label: 'Coffee News' },
    { code: 'RECIPES', label: 'Pastry & Beverage Recipes' }
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-8 flex flex-col gap-10">
      
      {/* Page Header */}
      <div className="text-left border-b border-coffee-100 pb-6">
        <h1 className="font-display text-4xl font-extrabold text-coffee-950 font-sinhala">කෝපි Blog & Articles</h1>
        <p className="text-sm text-coffee-600 mt-2">Learn home brewing methods, organic farming tips, and coffee history.</p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Category Pill Tabs */}
        <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto">
          {categories.map(cat => (
            <button
              key={cat.code}
              onClick={() => setSelectedCategory(cat.code)}
              className={`rounded-full px-5 py-2 text-xs font-semibold transition ${
                selectedCategory === cat.code
                  ? 'bg-coffee-700 text-white shadow-sm'
                  : 'bg-white border border-coffee-200 text-coffee-800 hover:bg-coffee-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72 shrink-0">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-coffee-400" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-coffee-200 bg-white py-2.5 pl-9 pr-4 text-xs text-coffee-900 focus:border-coffee-500 focus:outline-none"
          />
        </div>

      </div>

      {/* Blogs Grid */}
      {filteredBlogs.length === 0 ? (
        <div className="text-center py-16 text-coffee-500 text-xs italic">
          No articles match your search criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              onClick={() => setSelectedBlog(blog)}
              className="flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-coffee-100 shadow-sm hover:shadow-md transition duration-200 cursor-pointer"
            >
              <div className="h-64 overflow-hidden bg-coffee-50">
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="h-full w-full object-cover transition duration-300 hover:scale-105"
                />
              </div>

              <div className="flex flex-col gap-3.5 p-6 flex-grow justify-between">
                <div>
                  <div className="flex items-center gap-3 text-[10px] text-coffee-500 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1"><FaTag /> {blog.category?.replace('_', ' ')}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><FaCalendarAlt /> {new Date(blog.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-coffee-950 mt-2 line-clamp-2 leading-snug">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-coffee-750 line-clamp-3 mt-2.5 leading-relaxed">
                    {blog.content}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-coffee-50 pt-4 mt-6">
                  <span className="text-xs text-coffee-600 flex items-center gap-1.5 font-medium">
                    <FaUser className="text-[10px] text-coffee-400" /> By {blog.author}
                  </span>
                  <span className="text-xs font-bold text-coffee-800 hover:text-coffee-600">
                    Read Article →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* BLOG DETAIL OVERLAY MODAL */}
      {selectedBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-coffee-100 flex flex-col max-h-[90vh] text-left">
            <button
              onClick={() => setSelectedBlog(null)}
              className="absolute right-4 top-4 z-20 rounded-full bg-white/80 p-2 text-coffee-800 hover:text-coffee-600 focus:outline-none shadow-sm"
            >
              <FaTimes />
            </button>

            <div className="overflow-y-auto">
              <img
                src={selectedBlog.imageUrl}
                alt={selectedBlog.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-8 flex flex-col gap-4">
                <div className="flex items-center gap-3 text-[10px] text-coffee-500 font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1"><FaTag /> {selectedBlog.category?.replace('_', ' ')}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><FaCalendarAlt /> {new Date(selectedBlog.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>By {selectedBlog.author}</span>
                </div>

                <h2 className="font-display text-2xl font-bold text-coffee-950 leading-tight">
                  {selectedBlog.title}
                </h2>

                <p className="text-xs text-coffee-800 leading-relaxed whitespace-pre-line mt-2">
                  {selectedBlog.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
