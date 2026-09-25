
// 'use client';

// import { Suspense, useEffect, useState } from 'react';
// import { useSearchParams } from 'next/navigation';
// import { getOrderById, subscribeToOrders } from '@/lib/services/orderService';
// import { hasSupabaseClient } from '@/lib/supabase';

// type OrderStatus = 'pending' | 'preparing' | 'ready' | 'on the way' | 'delivered';

// interface TrackingStep {
//   status: OrderStatus;
//   label: string;
// }

// const steps: TrackingStep[] = [
//   { status: 'pending', label: 'Order Placed' },
//   { status: 'preparing', label: 'Preparing' },
//   { status: 'ready', label: 'Ready for Pickup' },
//   { status: 'on the way', label: 'On the Way' },
//   { status: 'delivered', label: 'Delivered' }
// ];

// function TrackOrderContent() {
//   const searchParams = useSearchParams();
//   const orderId = searchParams.get('orderId');
//   const [currentStep, setCurrentStep] = useState(0);
//   const [orderInput, setOrderInput] = useState(orderId || '');
//   const [isTracking, setIsTracking] = useState(!!orderId);
//   const [trackedOrderId, setTrackedOrderId] = useState(orderId || '');
//   const [isLoadingOrder, setIsLoadingOrder] = useState(false);
//   const [orderNotFound, setOrderNotFound] = useState(false);
//   const supabaseConfigured = hasSupabaseClient();

//   // Real tracking: fetch the actual order status from Supabase and keep it
//   // in sync with live updates from the kitchen/admin side.
//   useEffect(() => {
//     if (!supabaseConfigured || !isTracking || !trackedOrderId) return;

//     let isCancelled = false;

//     const applyOrderStatus = (status: string) => {
//       const stepIndex = steps.findIndex(s => s.status === status);
//       if (stepIndex !== -1) {
//         setCurrentStep(stepIndex);
//       }
//     };

//     const fetchOrder = async () => {
//       setIsLoadingOrder(true);
//       setOrderNotFound(false);
//       const result = await getOrderById(trackedOrderId);
//       if (isCancelled) return;
//       setIsLoadingOrder(false);
//       if (!result?.order) {
//         setOrderNotFound(true);
//         return;
//       }
//       applyOrderStatus(result.order.status);
//     };

//     fetchOrder();

//     const unsubscribe = subscribeToOrders((payload) => {
//       const updated = payload?.new;
//       if (updated?.id === trackedOrderId && updated?.status) {
//         applyOrderStatus(updated.status);
//       }
//     });

//     return () => {
//       isCancelled = true;
//       unsubscribe();
//     };
//   }, [supabaseConfigured, isTracking, trackedOrderId]);

//   // Demo fallback: if Supabase isn't configured there's no real order to
//   // fetch, so simulate progress for preview purposes.
//   useEffect(() => {
//     if (supabaseConfigured || !isTracking) return;

//     const interval = setInterval(() => {
//       setCurrentStep(prev => {
//         if (prev < steps.length - 1) {
//           return prev + 1;
//         }
//         clearInterval(interval);
//         return prev;
//       });
//     }, 3000);
//     return () => clearInterval(interval);
//   }, [supabaseConfigured, isTracking]);

//   const handleTrack = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (orderInput.trim()) {
//       setTrackedOrderId(orderInput.trim());
//       setIsTracking(true);
//       setCurrentStep(0);
//     }
//   };

//   return (
//     <div className="py-16 md:py-24 bg-[#F8F8F8]">
//       <div className="max-w-4xl mx-auto px-6">
//         <div className="text-center mb-12">
//           <p className="text-[#D4AF37] text-sm tracking-[0.3em] uppercase mb-3 font-medium">Order Status</p>
//           <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#111111]">Track Your Order</h1>
//         </div>

//         <form onSubmit={handleTrack} className="bg-white rounded-2xl luxury-shadow-sm p-8 mb-10">
//           <div className="flex flex-col md:flex-row gap-4">
//             <input
//               type="text"
//               value={orderInput}
//               onChange={(e) => setOrderInput(e.target.value)}
//               placeholder="Enter your order ID"
//               className="flex-1 px-6 py-4 border-2 border-[#E5E5E5] rounded-xl focus:ring-0 focus:border-[#D4AF37] outline-none transition-colors duration-300 text-[#111111] placeholder-[#999999]"
//             />
//             <button
//               type="submit"
//               className="bg-[#111111] text-white px-10 py-4 rounded-xl font-semibold tracking-wide hover:bg-[#D4AF37] hover:text-[#111111] transition-all duration-300"
//             >
//               Track Order
//             </button>
//           </div>
//         </form>

//         {isTracking && isLoadingOrder && (
//           <div className="bg-white rounded-2xl luxury-shadow-sm p-12 text-center">
//             <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//             <p className="text-[#666666] tracking-wide">Looking up your order...</p>
//           </div>
//         )}

//         {isTracking && !isLoadingOrder && orderNotFound && (
//           <div className="bg-white rounded-2xl luxury-shadow-sm p-12 text-center">
//             <h3 className="text-xl font-serif font-semibold text-[#111111] mb-3">Order Not Found</h3>
//             <p className="text-[#666666]">
//               We couldn&apos;t find an order with that ID. Please double-check the ID and try again.
//             </p>
//           </div>
//         )}

//         {isTracking && !isLoadingOrder && !orderNotFound && (
//           <div className="bg-white rounded-2xl luxury-shadow-sm p-8 md:p-12">
//             {trackedOrderId && (
//               <div className="mb-12 text-center pb-8 luxury-divider">
//                 <p className="text-sm text-[#666666] mb-2 tracking-wide">Order ID</p>
//                 <p className="text-3xl font-bold text-[#D4AF37] font-serif tracking-widest">{trackedOrderId}</p>
//               </div>
//             )}

//             <div className="relative">
//               <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-[#E5E5E5]"></div>
              
//               <div className="space-y-12">
//                 {steps.map((step, index) => (
//                   <div key={step.status} className="relative flex items-start gap-6 md:gap-8">
//                     <div className={`relative z-10 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-500 ${
//                       index <= currentStep 
//                         ? 'bg-[#D4AF37] text-[#111111] scale-100' 
//                         : 'bg-[#E5E5E5] text-[#999999] scale-90'
//                     }`}>
//                       {index <= currentStep ? (
//                         <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"></path>
//                         </svg>
//                       ) : (
//                         <span className="text-lg font-bold">{index + 1}</span>
//                       )}
//                     </div>
//                     <div className={`flex-1 pt-1 transition-all duration-500 ${
//                       index <= currentStep ? 'opacity-100' : 'opacity-40'
//                     }`}>
//                       <h3 className={`text-lg md:text-xl font-serif font-semibold ${
//                         index <= currentStep ? 'text-[#111111]' : 'text-[#999999]'
//                       }`}>
//                         {step.label}
//                       </h3>
//                       {index === currentStep && (
//                         <p className="text-sm text-[#D4AF37] mt-2 flex items-center gap-2">
//                           <span className="relative flex h-2 w-2">
//                             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
//                             <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]"></span>
//                           </span>
//                           In progress...
//                         </p>
//                       )}
//                       {index < currentStep && (
//                         <p className="text-sm text-[#D4AF37] mt-2">Completed</p>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {currentStep === steps.length - 1 && (
//               <div className="mt-12 text-center p-8 bg-gradient-to-br from-[#D4AF37]/10 to-[#D4AF37]/5 rounded-2xl border border-[#D4AF37]/20">
//                 <div className="text-5xl mb-4">🎉</div>
//                 <h3 className="text-2xl font-serif font-bold text-[#111111] mb-2">Order Delivered!</h3>
//                 <p className="text-[#666666]">Enjoy your meal and thank you for dining with us!</p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default function TrackOrderPage() {
//   return (
//     <Suspense fallback={
//       <div className="py-16 md:py-24 bg-[#F8F8F8]">
//         <div className="max-w-4xl mx-auto px-6 text-center">
//           <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto"></div>
//         </div>
//       </div>
//     }>
//       <TrackOrderContent />
//     </Suspense>
//   );
// }




'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getOrderById, subscribeToOrders } from '@/lib/services/orderService';
import { hasSupabaseClient } from '@/lib/supabase';

type OrderStatus = 'pending' | 'preparing' | 'ready' | 'on the way' | 'delivered';

interface TrackingStep {
  status: OrderStatus;
  label: string;
}

const steps: TrackingStep[] = [
  { status: 'pending', label: 'Order Placed' },
  { status: 'preparing', label: 'Preparing' },
  { status: 'ready', label: 'Ready for Pickup' },
  { status: 'on the way', label: 'On the Way' },
  { status: 'delivered', label: 'Delivered' }
];

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [currentStep, setCurrentStep] = useState(0);
  const [orderInput, setOrderInput] = useState(orderId || '');
  const [isTracking, setIsTracking] = useState(!!orderId);
  const [trackedOrderId, setTrackedOrderId] = useState(orderId || '');
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);
  const [orderNotFound, setOrderNotFound] = useState(false);
  const supabaseConfigured = hasSupabaseClient();

  // Real tracking: fetch the actual order status from Supabase and keep it
  // in sync with live updates from the kitchen/admin side.
  useEffect(() => {
    if (!supabaseConfigured || !isTracking || !trackedOrderId) return;

    let isCancelled = false;

    const applyOrderStatus = (status: string) => {
      const stepIndex = steps.findIndex(s => s.status === status);
      if (stepIndex !== -1) {
        setCurrentStep(stepIndex);
      }
    };

    const fetchOrder = async (showLoadingSpinner: boolean) => {
      if (showLoadingSpinner) {
        setIsLoadingOrder(true);
        setOrderNotFound(false);
      }
      const result = await getOrderById(trackedOrderId);
      if (isCancelled) return;
      if (showLoadingSpinner) setIsLoadingOrder(false);
      if (!result?.order) {
        if (showLoadingSpinner) setOrderNotFound(true);
        return;
      }
      applyOrderStatus(result.order.status);
    };

    fetchOrder(true);

    // Live updates via subscription only reach the order's own owner/admin
    // session (Realtime respects the same row-level security as reads), so
    // we also poll periodically - this covers a customer checking status
    // while logged out or from a different device.
    const pollInterval = setInterval(() => fetchOrder(false), 15000);

    const unsubscribe = subscribeToOrders((payload) => {
      const updated = payload?.new;
      if (updated?.id === trackedOrderId && updated?.status) {
        applyOrderStatus(updated.status);
      }
    });

    return () => {
      isCancelled = true;
      clearInterval(pollInterval);
      unsubscribe();
    };
  }, [supabaseConfigured, isTracking, trackedOrderId]);

  // Demo fallback: if Supabase isn't configured there's no real order to
  // fetch, so simulate progress for preview purposes.
  useEffect(() => {
    if (supabaseConfigured || !isTracking) return;

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [supabaseConfigured, isTracking]);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderInput.trim()) {
      setTrackedOrderId(orderInput.trim());
      setIsTracking(true);
      setCurrentStep(0);
    }
  };

  return (
    <div className="py-16 md:py-24 bg-[#F8F8F8]">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-[#D4AF37] text-sm tracking-[0.3em] uppercase mb-3 font-medium">Order Status</p>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#111111]">Track Your Order</h1>
        </div>

        <form onSubmit={handleTrack} className="bg-white rounded-2xl luxury-shadow-sm p-8 mb-10">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={orderInput}
              onChange={(e) => setOrderInput(e.target.value)}
              placeholder="Enter your order ID"
              className="flex-1 px-6 py-4 border-2 border-[#E5E5E5] rounded-xl focus:ring-0 focus:border-[#D4AF37] outline-none transition-colors duration-300 text-[#111111] placeholder-[#999999]"
            />
            <button
              type="submit"
              className="bg-[#111111] text-white px-10 py-4 rounded-xl font-semibold tracking-wide hover:bg-[#D4AF37] hover:text-[#111111] transition-all duration-300"
            >
              Track Order
            </button>
          </div>
        </form>

        {isTracking && isLoadingOrder && (
          <div className="bg-white rounded-2xl luxury-shadow-sm p-12 text-center">
            <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#666666] tracking-wide">Looking up your order...</p>
          </div>
        )}

        {isTracking && !isLoadingOrder && orderNotFound && (
          <div className="bg-white rounded-2xl luxury-shadow-sm p-12 text-center">
            <h3 className="text-xl font-serif font-semibold text-[#111111] mb-3">Order Not Found</h3>
            <p className="text-[#666666]">
              We couldn&apos;t find an order with that ID. Please double-check the ID and try again.
            </p>
          </div>
        )}

        {isTracking && !isLoadingOrder && !orderNotFound && (
          <div className="bg-white rounded-2xl luxury-shadow-sm p-8 md:p-12">
            {trackedOrderId && (
              <div className="mb-12 text-center pb-8 luxury-divider">
                <p className="text-sm text-[#666666] mb-2 tracking-wide">Order ID</p>
                <p className="text-3xl font-bold text-[#D4AF37] font-serif tracking-widest">{trackedOrderId}</p>
              </div>
            )}

            <div className="relative">
              <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-[#E5E5E5]"></div>
              
              <div className="space-y-12">
                {steps.map((step, index) => (
                  <div key={step.status} className="relative flex items-start gap-6 md:gap-8">
                    <div className={`relative z-10 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-500 ${
                      index <= currentStep 
                        ? 'bg-[#D4AF37] text-[#111111] scale-100' 
                        : 'bg-[#E5E5E5] text-[#999999] scale-90'
                    }`}>
                      {index <= currentStep ? (
                        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"></path>
                        </svg>
                      ) : (
                        <span className="text-lg font-bold">{index + 1}</span>
                      )}
                    </div>
                    <div className={`flex-1 pt-1 transition-all duration-500 ${
                      index <= currentStep ? 'opacity-100' : 'opacity-40'
                    }`}>
                      <h3 className={`text-lg md:text-xl font-serif font-semibold ${
                        index <= currentStep ? 'text-[#111111]' : 'text-[#999999]'
                      }`}>
                        {step.label}
                      </h3>
                      {index === currentStep && (
                        <p className="text-sm text-[#D4AF37] mt-2 flex items-center gap-2">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]"></span>
                          </span>
                          In progress...
                        </p>
                      )}
                      {index < currentStep && (
                        <p className="text-sm text-[#D4AF37] mt-2">Completed</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {currentStep === steps.length - 1 && (
              <div className="mt-12 text-center p-8 bg-gradient-to-br from-[#D4AF37]/10 to-[#D4AF37]/5 rounded-2xl border border-[#D4AF37]/20">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-serif font-bold text-[#111111] mb-2">Order Delivered!</h3>
                <p className="text-[#666666]">Enjoy your meal and thank you for dining with us!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={
      <div className="py-16 md:py-24 bg-[#F8F8F8]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    }>
      <TrackOrderContent />
    </Suspense>
  );
}