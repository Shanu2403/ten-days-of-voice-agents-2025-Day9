'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Plus } from '@phosphor-icons/react/dist/ssr';

const DEALS = [
  {
    id: 1,
    title: 'Amul Taaza Milk',
    price: '27',
    originalPrice: '30',
    tag: 'FRESH',
    desc: 'Toned Milk, Pasteurized',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/19512a.jpg?ts=1647923044',
    color: 'bg-blue-50 border-blue-100',
  },
  {
    id: 2,
    title: 'Farm Fresh Eggs',
    price: '65',
    originalPrice: '85',
    tag: '15% OFF',
    desc: 'Table White Eggs (6 pcs)',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/1205a.jpg?ts=1647923044',
    color: 'bg-orange-50 border-orange-100',
  },
  {
    id: 3,
    title: 'Lays Classic Salted',
    price: '20',
    originalPrice: '20',
    tag: 'CRUNCHY',
    desc: 'Potato Chips, 52g',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/1205a.jpg?ts=1647923044',
    color: 'bg-yellow-50 border-yellow-100',
  },
];

export function DealsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % DEALS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-xl">
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {DEALS.map((deal, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative flex-shrink-0 w-72 overflow-hidden rounded-xl ${deal.color} p-4 shadow-sm transition-transform hover:scale-105 cursor-pointer`}
          >
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <span className="inline-block rounded-md bg-white/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-800 shadow-sm mb-2">
                  {deal.tag}
                </span>
                <h3 className="text-lg font-black text-slate-900 leading-tight mb-1">
                  {deal.title}
                </h3>
                <p className="text-xs font-medium text-slate-700">{deal.desc}</p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 line-through">₹{deal.originalPrice}</span>
                  <span className="text-lg font-black text-slate-900">₹{deal.price}</span>
                </div>
                <button className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm text-slate-900 hover:bg-slate-50">
                  <Plus weight="bold" />
                </button>
              </div>
            </div>

            {/* Product Image Placeholder */}
            <div className="absolute -right-4 -bottom-4 h-32 w-32 opacity-20 rotate-12">
              <img src={deal.image} alt={deal.title} className="w-full h-full object-contain" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
