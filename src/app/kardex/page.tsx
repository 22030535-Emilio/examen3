'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiFetch, endpoints } from '@/lib/api';
import { PageWithRawData } from '@/components/PageWithRawData';
import styles from './Kardex.module.css';

export default function KardexPage() {
  const { token } = useAuth();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) { setError('Sin token.'); setIsLoading(false); return; }
    apiFetch<any>(endpoints.kardex, {}, token)
      .then(res => setData(res))
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [token]);

  if (isLoading) return (
    <div className={styles.container}>
      <h1>Cargando Kardex...</h1>
      {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '200px', borderRadius: 'var(--radius-lg)', marginTop: '1rem' }} />)}
    </div>
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Historial Académico</h1>
          <p>Trayectoria completa de tu formación profesional.</p>
        </div>
      </header>
      {error && <p style={{ color: 'var(--accent)' }}>⚠️ {error}</p>}
      {data && <PageWithRawData data={data} />}
    </div>
  );
}
