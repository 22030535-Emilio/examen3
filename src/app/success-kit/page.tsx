'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Bell, 
  Plus, 
  Trash2, 
  TrendingUp, 
  Info,
  Calendar,
  Award
} from 'lucide-react';
import styles from './SuccessKit.module.css';
import { motion, AnimatePresence } from 'framer-motion';

interface Subject {
  id: string;
  name: string;
  grade: number;
  credits: number;
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  category: string;
}

export default function SuccessKitPage() {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: '1', name: 'Materia 1', grade: 0, credits: 4 }
  ]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentGPA, setCurrentGPA] = useState(0);

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const res = await fetch('/api/announcements');
        const data = await res.json();
        setAnnouncements(data);
      } catch (err) {
        console.error('Error fetching announcements:', err);
      }
    }
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);
    const weightedSum = subjects.reduce((sum, s) => sum + (s.grade * s.credits), 0);
    setCurrentGPA(totalCredits > 0 ? weightedSum / totalCredits : 0);
  }, [subjects]);

  const addSubject = () => {
    setSubjects([...subjects, { id: Date.now().toString(), name: `Materia ${subjects.length + 1}`, grade: 0, credits: 4 }]);
  };

  const removeSubject = (id: string) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter(s => s.id !== id));
    }
  };

  const updateSubject = (id: string, field: keyof Subject, value: any) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Student Success Kit</h1>
        <p>Herramientas exclusivas para potenciar tu rendimiento académico.</p>
      </header>

      <div className={styles.mainGrid}>
        {/* GPA Calculator Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Calculator size={24} color="var(--primary)" />
            <h2>Calculadora de Promedio</h2>
          </div>
          
          <div className={styles.calcCard}>
            <div className={styles.gpaDisplay}>
              <div className={styles.gpaLabel}>Promedio Proyectado</div>
              <div className={styles.gpaValue}>{currentGPA.toFixed(2)}</div>
              <div className={styles.progressTrack}>
                <div 
                  className={styles.progressBar} 
                  style={{ width: `${(currentGPA / 100) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className={styles.subjectsList}>
              {subjects.map((subject, index) => (
                <motion.div 
                  key={subject.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={styles.subjectRow}
                >
                  <input 
                    type="text" 
                    value={subject.name}
                    placeholder="Materia"
                    onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                    className={styles.nameInput}
                  />
                  <div className={styles.inputGroup}>
                    <label>Créditos</label>
                    <input 
                      type="number" 
                      value={subject.credits}
                      onChange={(e) => updateSubject(subject.id, 'credits', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Calificación</label>
                    <input 
                      type="number" 
                      value={subject.grade}
                      onChange={(e) => updateSubject(subject.id, 'grade', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <button 
                    onClick={() => removeSubject(subject.id)}
                    className={styles.deleteBtn}
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))}
            </div>

            <button onClick={addSubject} className={styles.addBtn}>
              <Plus size={20} />
              <span>Añadir Materia</span>
            </button>
          </div>
        </section>

        {/* Announcements Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Bell size={24} color="var(--accent)" />
            <h2>Anuncios de la Comunidad</h2>
          </div>

          <div className={styles.announcementsList}>
            {announcements.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={styles.announcementCard}
              >
                <div className={styles.announcementHeader}>
                  <span className={styles.category}>{item.category}</span>
                  <span className={styles.date}>{item.date}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.content}</p>
              </motion.div>
            ))}
          </div>

          <div className={styles.tipCard}>
            <Info size={20} />
            <p><strong>Tip Pro:</strong> Mantén un promedio superior a 90 para acceder a programas de intercambio internacional.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
