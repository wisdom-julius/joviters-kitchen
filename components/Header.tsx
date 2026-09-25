
// 'use client';

// import type { User } from '@supabase/supabase-js';
// import Link from 'next/link';
// import { useEffect, useState } from 'react';
// import { useCart } from '@/lib/CartContext';
// import { getSafeSession, onSafeAuthStateChange, signOutSafely, supabase } from '@/lib/supabase';

// export function Header() {
//   const { cartCount } = useCart();
//   const [user, setUser] = useState<User | null>(null);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   useEffect(() => {
//     if (!supabase) return;

//     const getSession = async () => {
//       const session = await getSafeSession();
//       setUser(session?.user || null);
//     };

//     getSession();

//     const unsubscribe = onSafeAuthStateChange((_event, session) => {
//       setUser(session?.user || null);
//     });

//     return unsubscribe;
//   }, []);

//   const handleSignOut = async () => {
//     if (supabase) {
//       await signOutSafely();
//     }
//     setIsMobileMenuOpen(false);
//   };

//   return (
//     <header className="luxury-gradient text-white sticky top-0 z-50 border-b border-[rgba(212,175,55,0.3)]">
//       <div className="max-w-7xl mx-auto px-6 py-5">
//         <div className="flex items-center justify-between">
//           <Link href="/" className="flex items-center gap-3 group" onClick={() => setIsMobileMenuOpen(false)}>
//             <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#D4AF37] text-[#111111] text-xl font-serif">
//               JK
//             </div>
//             <div>
//               <h1 className="text-2xl font-semibold tracking-widest font-serif">JOVITER&apos;S</h1>
//               <p className="text-xs tracking-[0.3em] text-[#D4AF37] uppercase">KITCHEN</p>
//             </div>
//           </Link>

//           {/* Desktop nav - unchanged from before */}
//           <nav className="hidden md:flex items-center gap-8">
//             <Link href="/" className="text-sm tracking-wider uppercase hover:text-[#D4AF37] transition-colors duration-300 font-medium">
//               Home
//             </Link>
//             <Link href="/menu" className="text-sm tracking-wider uppercase hover:text-[#D4AF37] transition-colors duration-300 font-medium">
//               Menu
//             </Link>
//             <Link href="/track-order" className="text-sm tracking-wider uppercase hover:text-[#D4AF37] transition-colors duration-300 font-medium">
//               Track Order
//             </Link>
            
//             <div className="flex items-center gap-4">
//               {user ? (
//                 <div className="flex items-center gap-3">
//                   <button
//                     onClick={handleSignOut}
//                     className="text-xs tracking-wider uppercase text-gray-300 hover:text-[#D4AF37] transition-colors duration-300 font-medium px-3 py-1 border border-gray-600/30 rounded-full hover:border-[#D4AF37]/50"
//                   >
//                     Sign Out
//                   </button>
//                 </div>
//               ) : (
//                 <Link href="/login" className="text-sm tracking-wider uppercase hover:text-[#D4AF37] transition-colors duration-300 font-medium">
//                   Login
//                 </Link>
//               )}
              
//               <Link href="/cart" className="relative hover:text-[#D4AF37] transition-colors duration-300 group">
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
//                 </svg>
//                 {cartCount > 0 && (
//                   <span className="absolute -top-3 -right-3 w-6 h-6 bg-[#D4AF37] text-[#111111] text-xs font-bold flex items-center justify-center rounded-full">
//                     {cartCount}
//                   </span>
//                 )}
//               </Link>
//             </div>
//           </nav>

//           {/* Mobile: cart + hamburger toggle */}
//           <div className="flex items-center gap-5 md:hidden">
//             <Link href="/cart" className="relative hover:text-[#D4AF37] transition-colors duration-300" onClick={() => setIsMobileMenuOpen(false)}>
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
//               </svg>
//               {cartCount > 0 && (
//                 <span className="absolute -top-3 -right-3 w-6 h-6 bg-[#D4AF37] text-[#111111] text-xs font-bold flex items-center justify-center rounded-full">
//                   {cartCount}
//                 </span>
//               )}
//             </Link>
//             <button
//               type="button"
//               aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
//               aria-expanded={isMobileMenuOpen}
//               onClick={() => setIsMobileMenuOpen((prev) => !prev)}
//               className="p-1 hover:text-[#D4AF37] transition-colors duration-300"
//             >
//               {isMobileMenuOpen ? (
//                 <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               ) : (
//                 <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//                 </svg>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Mobile dropdown menu */}
//         {isMobileMenuOpen && (
//           <nav className="md:hidden flex flex-col gap-1 pt-5 mt-5 border-t border-[rgba(212,175,55,0.2)]">
//             <Link
//               href="/"
//               onClick={() => setIsMobileMenuOpen(false)}
//               className="text-sm tracking-wider uppercase hover:text-[#D4AF37] transition-colors duration-300 font-medium py-3"
//             >
//               Home
//             </Link>
//             <Link
//               href="/menu"
//               onClick={() => setIsMobileMenuOpen(false)}
//               className="text-sm tracking-wider uppercase hover:text-[#D4AF37] transition-colors duration-300 font-medium py-3"
//             >
//               Menu
//             </Link>
//             <Link
//               href="/track-order"
//               onClick={() => setIsMobileMenuOpen(false)}
//               className="text-sm tracking-wider uppercase hover:text-[#D4AF37] transition-colors duration-300 font-medium py-3"
//             >
//               Track Order
//             </Link>
//             {user ? (
//               <button
//                 onClick={handleSignOut}
//                 className="text-left text-sm tracking-wider uppercase text-gray-300 hover:text-[#D4AF37] transition-colors duration-300 font-medium py-3"
//               >
//                 Sign Out
//               </button>
//             ) : (
//               <Link
//                 href="/login"
//                 onClick={() => setIsMobileMenuOpen(false)}
//                 className="text-sm tracking-wider uppercase hover:text-[#D4AF37] transition-colors duration-300 font-medium py-3"
//               >
//                 Login
//               </Link>
//             )}
//           </nav>
//         )}
//       </div>
//     </header>
//   );
// }




'use client';

import type { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from '@/lib/CartContext';
import { getSafeSession, onSafeAuthStateChange, signOutSafely, supabase } from '@/lib/supabase';

export function Header() {
  const { cartCount } = useCart();
  const [user, setUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const handleSignOut = async () => {
    if (supabase) {
      await signOutSafely();
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="luxury-gradient text-white sticky top-0 z-50 border-b border-[rgba(212,175,55,0.3)]">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#D4AF37] text-[#111111] text-xl font-serif">
              JK
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-widest font-serif">JOVITER&apos;S</h1>
              <p className="text-xs tracking-[0.3em] text-[#D4AF37] uppercase">KITCHEN</p>
            </div>
          </Link>

          {/* Desktop nav - unchanged from before */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm tracking-wider uppercase hover:text-[#D4AF37] transition-colors duration-300 font-medium">
              Home
            </Link>
            <Link href="/menu" className="text-sm tracking-wider uppercase hover:text-[#D4AF37] transition-colors duration-300 font-medium">
              Menu
            </Link>
            <Link href="/track-order" className="text-sm tracking-wider uppercase hover:text-[#D4AF37] transition-colors duration-300 font-medium">
              Track Order
            </Link>
            
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/account"
                    className="text-xs tracking-wider uppercase text-gray-300 hover:text-[#D4AF37] transition-colors duration-300 font-medium px-3 py-1 border border-gray-600/30 rounded-full hover:border-[#D4AF37]/50"
                  >
                    Account
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-xs tracking-wider uppercase text-gray-300 hover:text-[#D4AF37] transition-colors duration-300 font-medium px-3 py-1 border border-gray-600/30 rounded-full hover:border-[#D4AF37]/50"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link href="/login" className="text-sm tracking-wider uppercase hover:text-[#D4AF37] transition-colors duration-300 font-medium">
                  Login
                </Link>
              )}
              
              <Link href="/cart" className="relative hover:text-[#D4AF37] transition-colors duration-300 group">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-3 -right-3 w-6 h-6 bg-[#D4AF37] text-[#111111] text-xs font-bold flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </nav>

          {/* Mobile: cart + hamburger toggle */}
          <div className="flex items-center gap-5 md:hidden">
            <Link href="/cart" className="relative hover:text-[#D4AF37] transition-colors duration-300" onClick={() => setIsMobileMenuOpen(false)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-3 -right-3 w-6 h-6 bg-[#D4AF37] text-[#111111] text-xs font-bold flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="p-1 hover:text-[#D4AF37] transition-colors duration-300"
            >
              {isMobileMenuOpen ? (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden flex flex-col gap-1 pt-5 mt-5 border-t border-[rgba(212,175,55,0.2)]">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm tracking-wider uppercase hover:text-[#D4AF37] transition-colors duration-300 font-medium py-3"
            >
              Home
            </Link>
            <Link
              href="/menu"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm tracking-wider uppercase hover:text-[#D4AF37] transition-colors duration-300 font-medium py-3"
            >
              Menu
            </Link>
            <Link
              href="/track-order"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm tracking-wider uppercase hover:text-[#D4AF37] transition-colors duration-300 font-medium py-3"
            >
              Track Order
            </Link>
            {user ? (
              <>
                <Link
                  href="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm tracking-wider uppercase hover:text-[#D4AF37] transition-colors duration-300 font-medium py-3"
                >
                  Account
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-left text-sm tracking-wider uppercase text-gray-300 hover:text-[#D4AF37] transition-colors duration-300 font-medium py-3"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm tracking-wider uppercase hover:text-[#D4AF37] transition-colors duration-300 font-medium py-3"
              >
                Login
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}