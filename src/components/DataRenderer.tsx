'use client';

import React from 'react';
import styles from './DataRenderer.module.css';

// Formats a camelCase/snake_case key into a readable label
function formatKey(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^\w/, c => c.toUpperCase())
    .trim();
}

// Keys that suggest the value is an image
const IMAGE_KEYS = ['foto', 'imagen', 'image', 'photo', 'avatar', 'img', 'picture', 'pic', 'thumbnail'];

function isImageKey(key: string) {
  return IMAGE_KEYS.some(k => key.toLowerCase().includes(k));
}

function isImageUrl(value: string) {
  return (
    typeof value === 'string' && (
      value.startsWith('data:image') ||
      /\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i.test(value) ||
      (value.startsWith('http') && value.length > 80 && /image|foto|photo|img|avatar/i.test(value))
    )
  );
}

// Renders a single value (string, number, boolean, null)
function PrimitiveValue({ value, fieldKey = '' }: { value: any, fieldKey?: string }) {
  if (value === null || value === undefined) return <span className={styles.null}>—</span>;
  if (typeof value === 'boolean') return <span className={value ? styles.yes : styles.no}>{value ? 'Sí' : 'No'}</span>;
  
  const str = String(value);
  
  // Render as image if key or value suggests it
  if (isImageKey(fieldKey) || isImageUrl(str)) {
    return (
      <div className={styles.imageWrapper}>
        <img src={str} alt={formatKey(fieldKey) || 'Imagen'} className={styles.profileImage} />
      </div>
    );
  }
  
  // Truncate very long strings (like tokens or base64)
  if (str.length > 80) {
    return (
      <span className={styles.truncated} title={str}>
        {str.substring(0, 60)}…
      </span>
    );
  }
  
  return <span>{str}</span>;
}

// Renders a flat key-value object as a styled grid of cards
export function ObjectCards({ data, title }: { data: Record<string, any>, title?: string }) {
  const entries = Object.entries(data).filter(([, v]) => typeof v !== 'object' || v === null);
  const nested = Object.entries(data).filter(([, v]) => typeof v === 'object' && v !== null);

  return (
    <div className={styles.objectCardWrapper}>
      {title && <h2 className={styles.sectionTitle}>{title}</h2>}
      {entries.length > 0 && (
        <div className={styles.cardsGrid}>
          {entries.map(([key, value]) => (
            <div key={key} className={`${styles.card} ${isImageKey(key) ? styles.imageCard : ''}`}>
              <span className={styles.cardLabel}>{formatKey(key)}</span>
              <span className={styles.cardValue}><PrimitiveValue value={value} fieldKey={key} /></span>
            </div>
          ))}
        </div>
      )}
      {nested.map(([key, value]) => (
        <div key={key} className={styles.nestedSection}>
          <h3 className={styles.nestedTitle}>{formatKey(key)}</h3>
          <DataRenderer data={value} />
        </div>
      ))}
    </div>
  );
}

// Renders an array of objects as a table
export function ArrayTable({ data, title }: { data: any[], title?: string }) {
  if (!data.length) return (
    <div className={styles.empty}>
      {title && <h2 className={styles.sectionTitle}>{title}</h2>}
      <p>Sin datos disponibles.</p>
    </div>
  );

  // Collect all unique keys across all items
  const keys = Array.from(new Set(data.flatMap(item => typeof item === 'object' ? Object.keys(item) : [])));

  if (keys.length === 0) {
    // Array of primitives
    return (
      <div className={styles.objectCardWrapper}>
        {title && <h2 className={styles.sectionTitle}>{title}</h2>}
        <div className={styles.cardsGrid}>
          {data.map((item, i) => (
            <div key={i} className={styles.card}>
              <span className={styles.cardValue}>{String(item)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tableSection}>
      {title && <h2 className={styles.sectionTitle}>{title}</h2>}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {keys.map(k => <th key={k}>{formatKey(k)}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {keys.map(k => (
                  <td key={k}>
                    {typeof row[k] === 'object' && row[k] !== null
                      ? <DataRenderer data={row[k]} compact />
                      : <PrimitiveValue value={row[k]} fieldKey={k} />
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Main renderer: detects if data is array or object and picks the right view
export function DataRenderer({ data, title, compact = false }: { data: any, title?: string, compact?: boolean }) {
  if (data === null || data === undefined) return <span className={styles.null}>—</span>;
  if (Array.isArray(data)) return <ArrayTable data={data} title={title} />;
  if (typeof data === 'object') {
    if (compact) {
      return (
        <div className={styles.compactObject}>
          {Object.entries(data).map(([k, v]) => (
            <span key={k} className={styles.compactEntry}>
              <span className={styles.compactKey}>{formatKey(k)}:</span>{' '}
              <PrimitiveValue value={typeof v === 'object' ? JSON.stringify(v) : v} />
            </span>
          ))}
        </div>
      );
    }
    return <ObjectCards data={data} title={title} />;
  }
  return <PrimitiveValue value={data} />;
}
