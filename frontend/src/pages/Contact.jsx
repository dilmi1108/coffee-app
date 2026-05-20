import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaPaperPlane } from 'react-icons/fa';

export const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && email && message) {
      setSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-8 flex flex-col gap-12 pb-20 text-left">
      
      {/* Page Header */}
      <div className="border-b border-coffee-100 pb-6">
        <h1 className="font-display text-4xl font-extrabold text-coffee-950 font-sinhala">Find Us & Contact</h1>
        <p className="text-sm text-coffee-600 mt-2">Have a question or feedback? We'd love to hear from you.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Contact Info & Hours */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* Card 1: Contact Details */}
          <div className="bg-white border border-coffee-100 p-6 rounded-2xl shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-bold text-coffee-950">Cafe Location</h3>
            <ul className="flex flex-col gap-4 text-xs text-coffee-800">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-coffee-600 mt-0.5 shrink-0" />
                <span>No. 45, Kandy Road, Colombo 07, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-coffee-600 shrink-0" />
                <span>+94 11 234 5678</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-coffee-600 shrink-0" />
                <span>hello@kopikade.lk</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Hours */}
          <div className="bg-white border border-coffee-100 p-6 rounded-2xl shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-bold text-coffee-950 flex items-center gap-2">
              <FaClock className="text-coffee-600" /> Opening Hours
            </h3>
            <ul className="flex flex-col gap-3 text-xs text-coffee-800 border-t border-coffee-50 pt-3">
              <li className="flex justify-between">
                <span className="font-semibold">Monday - Friday</span>
                <span className="text-coffee-600">6:30 AM - 9:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span className="font-semibold">Saturday - Sunday</span>
                <span className="text-coffee-600">8:00 AM - 10:00 PM</span>
              </li>
              <li className="flex justify-between text-green-700 font-bold border-t border-coffee-50 pt-2.5">
                <span>Poya Days</span>
                <span>Open (Closed on select holidays)</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white border border-coffee-100 p-6 md:p-8 rounded-2xl shadow-sm flex flex-col gap-6">
          <h3 className="text-base font-bold text-coffee-950">Send Us a Message</h3>
          
          {success && (
            <div className="rounded-xl bg-green-50 border border-green-150 p-4 text-xs font-semibold text-green-800">
              ✓ Message sent successfully! Our café manager will get back to you shortly.
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-xs text-coffee-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold uppercase tracking-wider text-coffee-800">Your Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="rounded-xl border border-coffee-200 bg-white px-4 py-2.5 text-xs text-coffee-950 focus:border-coffee-500 focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-bold uppercase tracking-wider text-coffee-800">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="rounded-xl border border-coffee-200 bg-white px-4 py-2.5 text-xs text-coffee-950 focus:border-coffee-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-bold uppercase tracking-wider text-coffee-800">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Inquiry or Feedback"
                className="rounded-xl border border-coffee-200 bg-white px-4 py-2.5 text-xs text-coffee-950 focus:border-coffee-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-bold uppercase tracking-wider text-coffee-800">Message *</label>
              <textarea
                rows="5"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What would you like to ask us?"
                className="rounded-xl border border-coffee-200 bg-white p-4 text-xs text-coffee-950 focus:border-coffee-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-fit flex items-center gap-2 rounded-full bg-coffee-700 px-8 py-3.5 text-xs font-bold text-white hover:bg-coffee-800 transition shadow-md"
            >
              Send Message <FaPaperPlane />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
