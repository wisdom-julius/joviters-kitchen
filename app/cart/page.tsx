import { CartSidebar } from '@/components/CartSidebar';

export default function CartPage() {
  return (
    <div className="py-16 md:py-24 bg-[#F8F8F8]">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-[#D4AF37] text-sm tracking-[0.3em] uppercase mb-3 font-medium">Your Selection</p>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#111111]">Shopping Cart</h1>
        </div>
        <CartSidebar />
      </div>
    </div>
  );
}
