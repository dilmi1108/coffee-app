import React from 'react';
import { FaCoffee, FaHeart, FaLeaf, FaHandsHelping } from 'react-icons/fa';

export const About = () => {
  const values = [
    {
      title: "Ethical Sourcing",
      desc: "We buy directly from organic smallholder growers in Kotmale, bypassing middlemen and paying a 25% premium above fair-market rates.",
      icon: FaLeaf
    },
    {
      title: "Handcrafted Quality",
      desc: "Every single cup is freshly ground and manual-dripped or pulled by professional baristas who live and breathe coffee craftsmanship.",
      icon: FaCoffee
    },
    {
      title: "Community Growth",
      desc: "We invest 5% of all profits back into rural schools and water filters for coffee-growing communities in the Central Highlands.",
      icon: FaHandsHelping
    }
  ];

  const steps = [
    { num: '01', title: 'Highland Sourcing', desc: 'Grown at 1,200m in mineral-rich volcanic soil.' },
    { num: '02', title: 'Craft Roasting', desc: 'Small-batch wood fire roasted to preserve natural floral notes.' },
    { num: '03', title: 'Precision Grinding', desc: 'Ground to order depending on your brewing style.' },
    { num: '04', title: 'Traditional Brewing', desc: 'Espressos, cold brews, or Ceylon spiced lattes.' }
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-8 flex flex-col gap-16 pb-20 text-left">
      
      {/* Hero Intro */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
        <div className="flex flex-col gap-5">
          <span className="w-fit rounded-full bg-coffee-100 px-3.5 py-1 text-xs font-bold uppercase text-coffee-800">
            🌿 Our Heritage
          </span>
          <h1 className="font-display text-4xl font-extrabold text-coffee-950 font-sinhala leading-tight">
            Our Mission is to Revive <br />
            <span className="text-coffee-600">Sri Lankan Coffee Culture</span>
          </h1>
          <p className="text-xs text-coffee-750 leading-relaxed">
            In the 1870s, Sri Lanka (then Ceylon) was one of the largest coffee exporters in the world. However, a devastating leaf disease wiped out the plantations, paving the way for Ceylon Tea.
          </p>
          <p className="text-xs text-coffee-750 leading-relaxed">
            At <strong>කෝපි කඩේ</strong>, we believe the time is right to reclaim this lost history. We work directly with small growers in the high mountains of Kotmale and Ella, blending traditional harvesting methods with modern coffee science.
          </p>
        </div>
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=600&auto=format&fit=crop"
            alt="Coffee Plantation"
            className="rounded-3xl shadow-xl w-full max-w-lg object-cover h-[350px] border-4 border-white"
          />
        </div>
      </div>

      {/* Core Values */}
      <div className="flex flex-col gap-8">
        <div className="text-center md:text-left">
          <h2 className="font-display text-2xl font-bold text-coffee-950">Our Core Pillars</h2>
          <p className="text-xs text-coffee-600 mt-1">What drives the daily grind at කෝපි කඩේ.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div key={idx} className="bg-white border border-coffee-100 p-6 rounded-2xl shadow-sm flex flex-col gap-4">
                <div className="rounded-xl bg-coffee-50 p-3 text-coffee-600 w-fit">
                  <Icon className="text-2xl" />
                </div>
                <h4 className="text-sm font-bold text-coffee-950">{val.title}</h4>
                <p className="text-xs text-coffee-600 leading-relaxed">{val.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Process Flow */}
      <div className="rounded-3xl bg-coffee-900 p-8 md:p-12 text-white shadow-xl flex flex-col gap-10">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-coffee-100">From Crop to Cup</h2>
          <p className="text-xs text-coffee-300 mt-1">Our step-by-step commitment to premium flavor.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <span className="text-3xl font-extrabold text-coffee-400 font-mono">{step.num}</span>
              <h4 className="text-sm font-bold mt-2 text-white">{step.title}</h4>
              <p className="text-[11px] text-coffee-200 max-w-[180px] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
