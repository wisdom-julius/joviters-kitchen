
'use client';

import type { User } from '@supabase/supabase-js';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from '@/lib/CartContext';
import { getSafeSession, onSafeAuthStateChange, supabase } from '@/lib/supabase';

export function CartSidebar() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
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

  const handleProceedToCheckout = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      setShowLoginPrompt(true);
      return;
    }
  };

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-2xl luxury-shadow-sm p-10 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#F8F8F8] flex items-center justify-center">
          <svg className="w-10 h-10 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-serif font-semibold text-[#111111] mb-3">Your Cart is Empty</h3>
        <p className="text-[#666666] mb-8 leading-relaxed">Discover our selection of authentic Nigerian dishes and begin your culinary journey.</p>
        <Link href="/menu" className="inline-flex items-center gap-2 bg-[#111111] text-white px-8 py-3 rounded-full font-medium text-sm tracking-wide hover:bg-[#D4AF37] hover:text-[#111111] transition-all duration-300">
          Explore Menu
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl luxury-shadow-sm overflow-hidden">
      <div className="p-6 border-b border-[#E5E5E5]">
        <h2 className="text-xl font-serif font-semibold text-[#111111]">Your Selection</h2>
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        {cart.map((cartItem) => (
          <div key={cartItem.item.id} className="p-6 border-b border-[#E5E5E5] last:border-b-0 flex gap-5">
            <div className="relative h-24 w-24 flex-shrink-0 rounded-xl overflow-hidden bg-[#F1ECE0]">
              {cartItem.item.image ? (
                <Image 
                  src={cartItem.item.image} 
                  alt={cartItem.item.name} 
                  fill 
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#F1ECE0] to-[#E5DCC8]">
                  <svg className="w-8 h-8 text-[#D4AF37]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v18m0-18c-1.5 0-3 1-3 3.5S10.5 10 12 10s3-1 3-3.5S13.5 3 12 3zm6 6c0 3-1.5 5-3 5.5V21m-9-9c0 3 1.5 5 3 5.5V21" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-serif font-semibold text-[#111111] mb-1">{cartItem.item.name}</h4>
              <p className="text-[#D4AF37] font-bold text-lg font-serif">₦{cartItem.item.price.toLocaleString()}</p>
              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-[#E5E5E5] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors duration-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="font-medium text-[#111111] w-8 text-center">{cartItem.quantity}</span>
                <button
                  onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-[#E5E5E5] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors duration-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <button
                  onClick={() => removeFromCart(cartItem.item.id)}
                  className="ml-auto text-[#999999] hover:text-[#D4AF37] transition-colors duration-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-6 border-t border-[#E5E5E5]">
        <div className="flex justify-between items-center mb-6">
          <span className="text-[#666666] font-medium">Total</span>
          <span className="text-3xl font-bold text-[#D4AF37] font-serif">₦{cartTotal.toLocaleString()}</span>
        </div>
        <Link
          href="/checkout"
          onClick={handleProceedToCheckout}
          className="block w-full bg-[#111111] text-white py-4 rounded-full font-semibold text-center tracking-wide hover:bg-[#D4AF37] hover:text-[#111111] transition-all duration-300"
        >
          Proceed to Checkout
        </Link>
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
                Please login to complete your checkout and place your order!
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
