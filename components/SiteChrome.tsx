'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    // The admin section has its own separate header/sidebar navigation
    // (see app/admin/layout.tsx) - showing the public site's header here
    // too was harmless-looking on desktop, but on mobile the two bars
    // overlap at the same position and the public one hides the admin
    // one entirely, making the admin nav unreachable.
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}