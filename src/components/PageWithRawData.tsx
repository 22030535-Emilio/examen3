'use client';

import React, { useState } from 'react';
import { DataRenderer } from './DataRenderer';
import styles from './PageWithRawData.module.css';

interface PageWithRawDataProps {
  data: any;
}

export function PageWithRawData({ data }: PageWithRawDataProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.wrapper}>
      {/* Pretty view */}
      <DataRenderer data={data} />

      {/* Raw JSON section */}
      <div className={styles.rawSection}>
        <button
          className={`${styles.rawToggle} ${open ? styles.rawToggleOpen : ''}`}
          onClick={() => setOpen(prev => !prev)}
        >
          <span className={styles.rawIcon}>{open ? '▼' : '▶'}</span>
          <span>Datos crudos de la API</span>
          <span className={styles.badge}>JSON</span>
        </button>

        {open && (
          <div className={styles.rawContent}>
            <pre className={styles.pre}>
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
