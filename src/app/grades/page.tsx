'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiFetch, endpoints } from '@/lib/api';
import { PageWithRawData } from '@/components/PageWithRawData';
import { Search, Filter } from 'lucide-react';
import styles from './Grades.module.css';

// Recursively finds the first array with objects in a response
function extractArray(data: any): any[] {
  if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') return data;
  if (typeof data === 'object' && data !== null) {
    for (const val of Object.values(data)) {
      const found = extractArray(val);
      if (found.length > 0) return found;
    }
  }
  return [];
}

// Find a numeric field that looks like a grade (0-100)
function getGradeValue(item: any): number | null {
  const priorityKeys = ['calificacion', 'calFinal', 'grade', 'nota', 'prom', 'cal'];
  for (const [k, v] of Object.entries(item)) {
    if (typeof v === 'number' && v >= 0 && v <= 100) {
      if (priorityKeys.some(p => k.toLowerCase().includes(p))) return v as number;
    }
  }
  for (const v of Object.values(item)) {
    if (typeof v === 'number' && (v as number) >= 0 && (v as number) <= 100) return v as number;
  }
  return null;
}

// Find a subject name field
function getSubjectName(item: any): string {
  const namePrefixes = ['materia', 'asignatura', 'nombre', 'name', 'subject'];
  for (const [k, v] of Object.entries(item)) {
    if (typeof v === 'string' && namePrefixes.some(p => k.toLowerCase().includes(p))) return v;
  }
  return Object.values(item).find(v => typeof v === 'string') as string || 'Materia';
}

// Find a period field
function getPeriod(item: any): string {
  const periodKeys = ['periodo', 'ciclo', 'semestre', 'period'];
  for (const [k, v] of Object.entries(item)) {
    if (periodKeys.some(p => k.toLowerCase().includes(p))) return String(v);
  }
  return '';
}

function gradeColor(grade: number): { bg: string; color: string; label: string } {
  if (grade >= 90) return { bg: 'rgba(34,197,94,0.12)', color: '#22c55e', label: 'Excelente' };
  if (grade >= 80) return { bg: 'rgba(99,102,241,0.12)', color: 'var(--primary)', label: 'Bien' };
  if (grade >= 70) return { bg: 'rgba(234,179,8,0.12)', color: '#eab308', label: 'Suficiente' };
  return { bg: 'rgba(244,63,94,0.12)', color: 'var(--accent)', label: 'Reprobado' };
}

export default function GradesPage() {
  const { token } = useAuth();
  const [rawData, setRawData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('Todos');

  useEffect(() => {
    if (!token) { setError('Sin token.'); setIsLoading(false); return; }
    apiFetch<any>(endpoints.grades, {}, token)
      .then(res => setRawData(res))
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [token]);

  const grades = useMemo(() => rawData ? extractArray(rawData) : [], [rawData]);
  const periods = useMemo(() => ['Todos', ...Array.from(new Set(grades.map(g => getPeriod(g)).filter(Boolean)))], [grades]);

  const filtered = useMemo(() => grades.filter(g => {
    const matchSearch = !search || JSON.stringify(g).toLowerCase().includes(search.toLowerCase());
    const matchPeriod = filterPeriod === 'Todos' || getPeriod(g) === filterPeriod;
    return matchSearch && matchPeriod;
  }), [grades, search, filterPeriod]);

  if (isLoading) return (
    <div className={styles.container}>
      <h1 style={{ marginBottom: '1.5rem' }}>Cargando calificaciones...</h1>
      {[1,2,3,4,5].map(i => <div key={i} className="skeleton" style={{ height: '80px', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }} />)}
    </div>
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Calificaciones</h1>
          <p>Materias y calificaciones del periodo vigente.</p>
        </div>
      </header>

      {error && (
        <div style={{ padding: '1rem', background: 'rgba(244,63,94,0.1)', borderRadius: 'var(--radius-md)', color: 'var(--accent)' }}>
          ⚠️ {error}
        </div>
      )}

      {grades.length > 0 && (
        <>
          {/* Controls */}
          <div className={styles.controls}>
            <div className={styles.searchWrapper}>
              <Search size={18} />
              <input
                type="text"
                placeholder="Buscar materia, periodo..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            {periods.length > 1 && (
              <div className={styles.filterWrapper}>
                <Filter size={18} />
                <select value={filterPeriod} onChange={e => setFilterPeriod(e.target.value)}>
                  {periods.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            )}
          </div>

          {/* Summary badges */}
          <div className={styles.summaryRow}>
            {(['#22c55e', 'var(--primary)', '#eab308', 'var(--accent)'] as const).map((c, i) => {
              const labels = ['≥ 90 Excelente', '80–89 Bien', '70–79 Suficiente', '< 70 Reprobado'];
              const ranges = [[90, 101], [80, 90], [70, 80], [0, 70]];
              const count = filtered.filter(g => {
                const v = getGradeValue(g);
                return v !== null && v >= ranges[i][0] && v < ranges[i][1];
              }).length;
              return (
                <div key={i} className={styles.summaryBadge} style={{ borderColor: c, color: c }}>
                  <strong>{count}</strong> {labels[i]}
                </div>
              );
            })}
          </div>

          {/* Grade cards */}
          <div className={styles.gradesList}>
            {filtered.length === 0 ? (
              <div className={styles.emptyState}>No hay resultados para "{search}"</div>
            ) : filtered.map((grade, i) => {
              const name = getSubjectName(grade);
              const period = getPeriod(grade);
              const gradeVal = getGradeValue(grade);
              const { bg, color, label } = gradeVal !== null ? gradeColor(gradeVal) : { bg: 'var(--card-bg)', color: 'var(--text-muted)', label: '' };
              return (
                <div key={i} className={styles.gradeCard} style={{ borderLeft: `4px solid ${color}` }}>
                  <div className={styles.gradeInfo}>
                    <h3>{name}</h3>
                    {period && <span className={styles.period}>{period}</span>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {label && <span className={styles.statusLabel} style={{ background: bg, color }}>{label}</span>}
                    {gradeVal !== null && (
                      <div className={styles.gradeCircle} style={{ background: bg, color }}>
                        {gradeVal}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Raw data section */}
      {rawData && <PageWithRawData data={rawData} />}
    </div>
  );
}
