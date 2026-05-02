import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartSlidePanel from '@/components/CartSlidePanel';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <CartSlidePanel />
      <main className="pt-[92px]">{children}</main>
      <Footer />
    </>
  );
}
