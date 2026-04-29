'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiFetch, endpoints } from '@/lib/api';
import { Sparkles, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import styles from './Login.module.css';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      setIsLoading(false);
      return;
    }

    try {
      const data = await apiFetch<any>(endpoints.login, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      // Token is at data.message.login.token
      console.log('[LOGIN] Raw response:', JSON.stringify(data));
      
      const token = data?.message?.login?.token
        || data?.token 
        || data?.access_token 
        || data?.accessToken
        || data?.data?.token;

      if (!token) {
        setError(`No se encontró el token. Respuesta: ${JSON.stringify(data)}`);
        setIsLoading(false);
        return;
      }

      console.log('[LOGIN] Token OK:', token.substring(0, 30) + '...');
      login(token);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={styles.loginCard}
      >
        <div className={styles.header}>
          <div className={styles.logoBadge}>
            <Sparkles size={32} />
          </div>
          <h1>Bienvenido de nuevo</h1>
          <p>Ingresa tus credenciales para acceder al portal SII ITC</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={styles.errorBanner}
            >
              <AlertCircle size={18} />
              <span>{error}</span>
            </motion.div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="email">Correo Electrónico</label>
            <div className={styles.inputWrapper}>
              <Mail className={styles.inputIcon} size={20} />
              <input
                id="email"
                type="email"
                placeholder="ejemplo@celaya.tecnm.mx"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Contraseña</label>
            <div className={styles.inputWrapper}>
              <Lock className={styles.inputIcon} size={20} />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className={styles.submitBtn} 
            disabled={isLoading}
          >
            {isLoading ? (
              <span className={styles.spinner}></span>
            ) : (
              <>
                <span>Iniciar Sesión</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <p>Examen 3 - Tópicos Avanzados de Programación Web</p>
        </div>
      </motion.div>

      {/* Decorative background elements */}
      <div className={styles.blob1}></div>
      <div className={styles.blob2}></div>
    </div>
  );
}
