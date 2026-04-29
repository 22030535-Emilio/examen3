'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Bell, 
  GraduationCap, 
  BarChart3, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle,
  XCircle,
  ShieldCheck,
  Search
} from 'lucide-react';
import styles from './Admin.module.css';
import { motion, AnimatePresence } from 'framer-motion';

interface Student {
  id: string;
  name: string;
  email: string;
  career: string;
  gpa: number;
  status: string;
  lastGrade?: number;
  lastSubject?: string;
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  category: string;
}

export default function AdminDashboard() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'students' | 'announcements'>('students');
  const [students, setStudents] = useState<Student[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', category: 'General' });
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [gradeForm, setGradeForm] = useState({ subject: '', grade: '' });

  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchData();
    }
  }, [isAdminAuthenticated]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Pre-defined admin password for the demo
    if (adminPassword === 'admin123') {
      setIsAdminAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
      setAdminPassword('');
    }
  };

  const fetchData = async () => {
    try {
      const [studentsRes, announcementsRes] = await Promise.all([
        fetch('/api/admin/students'),
        fetch('/api/announcements')
      ]);
      setStudents(await studentsRes.json());
      setAnnouncements(await announcementsRes.json());
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAnnouncement)
      });
      if (res.ok) {
        setNewAnnouncement({ title: '', content: '', category: 'General' });
        setIsModalOpen(false);
        fetchData();
      }
    } catch (err) {
      console.error('Error adding announcement:', err);
    }
  };

  const handleDeleteAnnouncement = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este anuncio?')) return;
    try {
      await fetch(`/api/announcements?id=${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error('Error deleting:', err);
    }
  };

  const handleUpdateGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    try {
      const res = await fetch('/api/admin/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          studentId: selectedStudent.id, 
          subject: gradeForm.subject, 
          grade: parseInt(gradeForm.grade) 
        })
      });
      if (res.ok) {
        setIsGradeModalOpen(false);
        setGradeForm({ subject: '', grade: '' });
        fetchData();
      }
    } catch (err) {
      console.error('Error updating grade:', err);
    }
  };

  if (!isAdminAuthenticated) {
    return (
      <div className={styles.container} style={{ justifyContent: 'center', alignItems: 'center', background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.modalContent}
          style={{ maxWidth: '400px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
        >
          <div className={styles.logo} style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
            <ShieldCheck size={48} />
          </div>
          <h2 style={{ marginBottom: '0.5rem' }}>Acceso Restringido</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '2rem' }}>
            Ingresa el código de seguridad para gestionar el portal académico.
          </p>

          <form onSubmit={handleAdminLogin}>
            <div className={styles.formGroup}>
              <input 
                type="password" 
                placeholder="Código de acceso"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                autoFocus
                style={{ textAlign: 'center', fontSize: '1.1rem', letterSpacing: '4px' }}
              />
            </div>
            {loginError && (
              <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '1rem' }}>
                Código incorrecto. Intenta de nuevo.
              </p>
            )}
            <button type="submit" className={styles.btnPrimary + ' ' + styles.btn} style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}>
              Verificar Identidad
            </button>
          </form>
          <div style={{ marginTop: '2rem' }}>
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className={styles.btnOutline + ' ' + styles.btn} 
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Regresar al Portal Alumno
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <ShieldCheck size={32} />
          <span>SII Admin</span>
        </div>
        <nav className={styles.nav}>
          <button 
            className={`${styles.navItem} ${activeTab === 'students' ? styles.activeNavItem : ''}`}
            onClick={() => setActiveTab('students')}
          >
            <Users size={20} />
            Gestión de Alumnos
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'announcements' ? styles.activeNavItem : ''}`}
            onClick={() => setActiveTab('announcements')}
          >
            <Bell size={20} />
            Comunicados
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div>
            <h1>Panel del Profesor</h1>
            <p style={{ color: '#94a3b8' }}>Bienvenido, Admin del Sistema Académico</p>
          </div>
          <button className={styles.btnPrimary + ' ' + styles.btn}>
            <BarChart3 size={18} />
            Generar Reporte
          </button>
        </header>

        {/* Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon}`} style={{ backgroundColor: '#10b98120', color: '#10b981' }}>
              <Users size={24} />
            </div>
            <div className={styles.statInfo}>
              <h3>Alumnos Totales</h3>
              <p>{students.length}</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon}`} style={{ backgroundColor: '#6366f120', color: '#6366f1' }}>
              <GraduationCap size={24} />
            </div>
            <div className={styles.statInfo}>
              <h3>Promedio Grupal</h3>
              <p>87.5</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon}`} style={{ backgroundColor: '#f59e0b20', color: '#f59e0b' }}>
              <Bell size={24} />
            </div>
            <div className={styles.statInfo}>
              <h3>Anuncios Activos</h3>
              <p>{announcements.length}</p>
            </div>
          </div>
        </div>

        {/* Dynamic Content */}
        {activeTab === 'students' ? (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Lista de Estudiantes</h2>
              <div className={styles.searchBox} style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
                <input 
                  type="text" 
                  placeholder="Buscar alumno..." 
                  style={{ paddingLeft: '35px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', color: 'white', padding: '8px 10px 8px 35px' }}
                />
              </div>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Carrera</th>
                  <th>Promedio</th>
                  <th>Estatus</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td>{student.career}</td>
                    <td>{student.gpa}%</td>
                    <td>
                      <span className={`${styles.badge} ${student.status === 'Excelencia' || student.status === 'Regular' ? styles.badgeSuccess : styles.badgeWarning}`}>
                        {student.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className={styles.btnOutline + ' ' + styles.btn} 
                        onClick={() => { setSelectedStudent(student); setIsGradeModalOpen(true); }}
                      >
                        <Edit3 size={14} />
                        Asignar Nota
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Gestión de Comunicados</h2>
              <button className={styles.btnPrimary + ' ' + styles.btn} onClick={() => setIsModalOpen(true)}>
                <Plus size={18} />
                Nuevo Anuncio
              </button>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Título</th>
                  <th>Categoría</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {announcements.map(ann => (
                  <tr key={ann.id}>
                    <td>{ann.date}</td>
                    <td>{ann.title}</td>
                    <td>{ann.category}</td>
                    <td style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className={styles.btnOutline + ' ' + styles.btn} onClick={() => handleDeleteAnnouncement(ann.id)}>
                        <Trash2 size={14} color="#ef4444" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Modal: New Announcement */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className={styles.modal}
          >
            <motion.div 
              initial={{ scale: 0.9 }} animate={{ scale: 1 }}
              className={styles.modalContent}
            >
              <h2>Crear Nuevo Comunicado</h2>
              <form onSubmit={handleAddAnnouncement} style={{ marginTop: '1.5rem' }}>
                <div className={styles.formGroup}>
                  <label>Título</label>
                  <input 
                    type="text" required 
                    value={newAnnouncement.title}
                    onChange={e => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Categoría</label>
                  <select 
                    value={newAnnouncement.category}
                    onChange={e => setNewAnnouncement({...newAnnouncement, category: e.target.value})}
                  >
                    <option>General</option>
                    <option>Becas</option>
                    <option>Sistemas</option>
                    <option>Idiomas</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Contenido</label>
                  <textarea 
                    rows={4} required
                    value={newAnnouncement.content}
                    onChange={e => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                    style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', color: 'white', padding: '0.75rem' }}
                  ></textarea>
                </div>
                <div className={styles.modalActions}>
                  <button type="button" className={styles.btnOutline + ' ' + styles.btn} onClick={() => setIsModalOpen(false)}>Cancelar</button>
                  <button type="submit" className={styles.btnPrimary + ' ' + styles.btn}>Publicar Anuncio</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal: Update Grade */}
      <AnimatePresence>
        {isGradeModalOpen && selectedStudent && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className={styles.modal}
          >
            <motion.div 
              initial={{ scale: 0.9 }} animate={{ scale: 1 }}
              className={styles.modalContent}
            >
              <h2>Asignar Calificación: {selectedStudent.name}</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.5rem' }}>ID: {selectedStudent.id}</p>
              
              <form onSubmit={handleUpdateGrade} style={{ marginTop: '1.5rem' }}>
                <div className={styles.formGroup}>
                  <label>Materia / Actividad</label>
                  <input 
                    type="text" required placeholder="Ej: Proyecto Final - Unidad 3"
                    value={gradeForm.subject}
                    onChange={e => setGradeForm({...gradeForm, subject: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Calificación (0-100)</label>
                  <input 
                    type="number" min="0" max="100" required 
                    value={gradeForm.grade}
                    onChange={e => setGradeForm({...gradeForm, grade: e.target.value})}
                  />
                </div>
                <div className={styles.modalActions}>
                  <button type="button" className={styles.btnOutline + ' ' + styles.btn} onClick={() => setIsGradeModalOpen(false)}>Cerrar</button>
                  <button type="submit" className={styles.btnPrimary + ' ' + styles.btn}>Guardar en el Sistema</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
