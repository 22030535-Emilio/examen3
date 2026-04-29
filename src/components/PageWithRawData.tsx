'use client';

import React from 'react';
import { DataRenderer } from './DataRenderer';
import styles from './PageWithRawData.module.css';

interface PageWithRawDataProps {
  data: any;
}

export function PageWithRawData({ data }: PageWithRawDataProps) {
  return (
    <div className={styles.wrapper}>
      {/* Pretty view only */}
      <DataRenderer data={data} />
    </div>
  );
}
