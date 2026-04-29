'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Calendar, 
  FileText, 
  Sparkles, 
  LogOut,
  User
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import styles from './Sidebar.module.css';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Calificaciones', href: '/grades', icon: GraduationCap },
  { name: 'Kardex', href: '/kardex', icon: FileText },
  { name: 'Horario', href: '/schedule', icon: Calendar },
  { name: 'Success Kit', href: '/success-kit', icon: Sparkles },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <Sparkles size={32} color="var(--primary)" />
        <span>SII ITC</span>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <Link href="/admin" className={styles.adminLink} style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          padding: '12px', 
          color: '#94a3b8', 
          textDecoration: 'none',
          fontSize: '0.9rem',
          marginBottom: '1rem',
          border: '1px dashed #334155',
          borderRadius: '8px'
        }}>
          <User size={18} />
          <span>Portal Profesor</span>
        </Link>
        <button onClick={logout} className={styles.logoutBtn}>
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
