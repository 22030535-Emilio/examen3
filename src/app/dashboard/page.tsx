'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiFetch, endpoints } from '@/lib/api';
import { PageWithRawData } from '@/components/PageWithRawData';
import styles from './Dashboard.module.css';

export default function DashboardPage() {
  const { token, isLoading: authLoading } = useAuth();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Wait for auth context to finish loading from cookies
    if (authLoading) return;

    if (!token) { 
      setError('Sin sesión activa. Por favor inicia sesión.'); 
      setIsLoading(false); 
      return; 
    }

    setIsLoading(true);
    setError(null);
    
    apiFetch<any>(endpoints.profile, {}, token)
      .then(res => setData(res))
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [token, authLoading]);

  if (isLoading) return (
    <div className={styles.container}>
      <h1 style={{ marginBottom: '1.5rem' }}>Cargando perfil...</h1>
      <div className={styles.grid}>
        {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: '120px', borderRadius: 'var(--radius-lg)' }} />)}
      </div>
    </div>
  );

  if (error) return (
    <div className={styles.container}>
      <div className={styles.errorContainer}>
        <h2>⚠️ Error</h2>
        <p style={{ color: 'var(--accent)', marginTop: '0.5rem' }}>{error}</p>
        <button onClick={() => window.location.reload()} className={styles.retryBtn} style={{ marginTop: '1rem' }}>Reintentar</button>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.welcome}>
          <h1>Mi Perfil</h1>
          <p>Información de tu cuenta en el sistema SII ITC</p>
        </div>
      </header>
      <PageWithRawData data={data} />
    </div>
  );
}
