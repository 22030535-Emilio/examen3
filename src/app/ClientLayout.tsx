'use client';

import { AuthProvider } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import styles from './ClientLayout.module.css';
import React from 'react';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isLoginPage = pathname === '/login';

  if (!mounted) return <div style={{ background: 'var(--background)', minHeight: '100vh' }}></div>;

  return (
    <AuthProvider>
      <div className={styles.layout}>
        {!isLoginPage && <Sidebar />}
        <main className={isLoginPage ? styles.fullWidth : styles.content}>
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}
