'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiFetch, endpoints } from '@/lib/api';
import { PageWithRawData } from '@/components/PageWithRawData';
import { Clock, MapPin, User } from 'lucide-react';
import styles from './Schedule.module.css';

// Recursively find first array with objects
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

function getDayValue(item: any): string {
  for (const [k, v] of Object.entries(item)) {
    if (k.toLowerCase().includes('dia') || k.toLowerCase().includes('day')) return String(v);
  }
  return 'Sin día';
}

function getTimeRange(item: any): string {
  const startKeys = ['hora_inicio', 'horaInicio', 'inicio', 'start', 'hora'];
  const endKeys = ['hora_fin', 'horaFin', 'fin', 'end'];
  let start = '', end = '';
  for (const [k, v] of Object.entries(item)) {
    if (!start && startKeys.some(p => k.toLowerCase().includes(p))) start = String(v);
    if (!end && endKeys.some(p => k.toLowerCase().includes(p))) end = String(v);
  }
  if (start && end) return `${start} – ${end}`;
  if (start) return start;
  return '';
}

function getSubjectName(item: any): string {
  const namePrefixes = ['materia', 'asignatura', 'nombre', 'name', 'subject'];
  for (const [k, v] of Object.entries(item)) {
    if (typeof v === 'string' && namePrefixes.some(p => k.toLowerCase().includes(p))) return v;
  }
  return Object.values(item).find(v => typeof v === 'string' && (v as string).length > 4) as string || 'Clase';
}

function getRoomAndTeacher(item: any): { room: string; teacher: string } {
  let room = '', teacher = '';
  for (const [k, v] of Object.entries(item)) {
    if (!room && (k.toLowerCase().includes('aula') || k.toLowerCase().includes('salon') || k.toLowerCase().includes('room'))) room = String(v);
    if (!teacher && (k.toLowerCase().includes('profesor') || k.toLowerCase().includes('docente') || k.toLowerCase().includes('teacher'))) teacher = String(v);
  }
  return { room, teacher };
}

const DAY_ORDER = ['lunes', 'martes', 'miercoles', 'miércoles', 'jueves', 'viernes', 'sabado', 'sábado', 'domingo'];

export default function SchedulePage() {
  const { token, isLoading: authLoading } = useAuth();
  const [rawData, setRawData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!token) { 
      setError('Sin sesión activa.'); 
      setIsLoading(false); 
      return; 
    }

    setIsLoading(true);
    setError(null);

    apiFetch<any>(endpoints.schedule, {}, token)
      .then(res => setRawData(res))
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [token, authLoading]);

  const schedule = useMemo(() => rawData ? extractArray(rawData) : [], [rawData]);

  const grouped = useMemo(() => {
    const g: Record<string, any[]> = {};
    for (const item of schedule) {
      const day = getDayValue(item);
      // Skip items with no day assigned
      if (!day || day === 'Sin día') continue;
      if (!g[day]) g[day] = [];
      g[day].push(item);
    }
    // Sort entries by day order
    return Object.fromEntries(
      Object.entries(g).sort(([a], [b]) => {
        const ai = DAY_ORDER.indexOf(a.toLowerCase());
        const bi = DAY_ORDER.indexOf(b.toLowerCase());
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
      })
    );
  }, [schedule]);

  const dayColors = ['#6366f1', '#06b6d4', '#f43f5e', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899'];

  if (isLoading) return (
    <div className={styles.container}>
      <h1 style={{ marginBottom: '1.5rem' }}>Cargando horario...</h1>
      <div className={styles.agendaGrid}>
        {[1,2,3,4,5].map(i => <div key={i} className="skeleton" style={{ height: '200px', borderRadius: 'var(--radius-lg)' }} />)}
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Horario Semestral</h1>
        <p>Clases organizadas por día y hora del semestre actual.</p>
      </header>

      {error && <p style={{ color: 'var(--accent)' }}>⚠️ {error}</p>}

      {schedule.length > 0 ? (
        <div className={styles.agendaGrid}>
          {Object.entries(grouped).map(([day, items], di) => {
            const color = dayColors[di % dayColors.length];
            const sorted = [...items].sort((a, b) => getTimeRange(a).localeCompare(getTimeRange(b)));
            return (
              <div key={day} className={styles.dayColumn}>
                <div className={styles.dayHeader} style={{ borderTop: `3px solid ${color}` }}>
                  <h2 style={{ color }}>{day}</h2>
                  <span className={styles.dayCount}>{items.length} clase{items.length !== 1 ? 's' : ''}</span>
                </div>
                <div className={styles.dayContent}>
                  {sorted.map((item, i) => {
                    const name = getSubjectName(item);
                    const time = getTimeRange(item);
                    const { room, teacher } = getRoomAndTeacher(item);
                    return (
                      <div key={i} className={styles.classCard} style={{ borderLeft: `3px solid ${color}` }}>
                        {time && (
                          <div className={styles.timeRow}>
                            <Clock size={12} />
                            <span>{time}</span>
                          </div>
                        )}
                        <h3 className={styles.className}>{name}</h3>
                        {room && <div className={styles.meta}><MapPin size={12} /><span>{room}</span></div>}
                        {teacher && <div className={styles.meta}><User size={12} /><span>{teacher}</span></div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : !error && (
        <div className={styles.emptyState}>No hay horario disponible para este periodo.</div>
      )}

      {rawData && <PageWithRawData data={rawData} />}
    </div>
  );
}
