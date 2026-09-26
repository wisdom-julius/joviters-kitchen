
'use client';

import type { User } from '@supabase/supabase-js';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MenuItem } from '@/types';
import { useCart } from '@/lib/CartContext';
import { useEffect, useState } from 'react';
import { getSafeSession, onSafeAuthStateChange, supabase } from '@/lib/supabase';

interface MenuCardProps {
  item: MenuItem;
}

export function MenuCard({ item }: MenuCardProps) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    
    const getSession = async () => {
      const session = await getSafeSession();
      setUser(session?.user || null);
    };

    getSession();

    const unsubscribe = onSafeAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return unsubscribe;
  }, []);

  const handleAddToCart = () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    addToCart(item);
    setShowLoginPrompt(false);
  };

  return (
    <div className="group bg-white rounded-2xl luxury-shadow-sm overflow-hidden hover:luxury-shadow transition-all duration-500 border border-transparent hover:border-[rgba(212,175,55,0.3)]">
      <div className="relative h-64 w-full overflow-hidden bg-[#F1ECE0]">
        {item.image ? (
          <Image 
            src={item.image} 
            alt={item.name} 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#F1ECE0] to-[#E5DCC8]">
            <svg className="w-16 h-16 text-[#D4AF37]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v18m0-18c-1.5 0-3 1-3 3.5S10.5 10 12 10s3-1 3-3.5S13.5 3 12 3zm6 6c0 3-1.5 5-3 5.5V21m-9-9c0 3 1.5 5 3 5.5V21" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/60 to-transparent" />
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-[#111111]/80 flex items-center justify-center">
            <span className="text-white font-semibold tracking-wider uppercase text-sm">Sold Out</span>
          </div>
        )}
        <div className="absolute top-4 right-4">
          <span className="bg-[#D4AF37] text-[#111111] px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">
            {item.category}
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-serif font-semibold text-[#111111] leading-tight">{item.name}</h3>
          <span className="text-[#D4AF37] font-bold text-xl font-serif">₦{item.price.toLocaleString()}</span>
        </div>
        <p className="text-[#666666] text-sm mb-6 leading-relaxed">{item.description}</p>
        <div className="flex items-center justify-between pt-4 border-t border-[#E5E5E5]">
          <div className="flex items-center gap-2 text-[#888888] text-xs">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{item.preparationTime} mins</span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!item.isAvailable}
            className={`group/btn px-6 py-2.5 rounded-full font-medium text-sm tracking-wide transition-all duration-300 ${
              item.isAvailable 
                ? 'bg-[#111111] text-white hover:bg-[#D4AF37] hover:text-[#111111]' 
                : 'bg-[#E5E5E5] text-[#999999] cursor-not-allowed'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add
            </span>
          </button>
        </div>
      </div>

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowLoginPrompt(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#111111] mb-4">Login Required</h3>
              <p className="text-gray-600 mb-8">
                Please login to place an order and enjoy delicious dishes from Joviter&apos;s Kitchen!
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowLoginPrompt(false)}
                  className="flex-1 px-6 py-3 rounded-full border-2 border-gray-300 text-gray-700 font-medium hover:border-gray-400 transition-all duration-300"
                >
                  Maybe Later
                </button>
                <button
                  onClick={() => {
                    setShowLoginPrompt(false);
                    router.push('/login');
                  }}
                  className="flex-1 px-6 py-3 rounded-full bg-[#111111] text-white font-medium hover:bg-[#D4AF37] hover:text-[#111111] transition-all duration-300"
                >
                  Login Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
