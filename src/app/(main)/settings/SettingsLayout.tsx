'use client';
import { ReactNode } from 'react';
import styles from './SettingsLayout.module.css';

export default function SettingsLayout({ children }: { children: ReactNode }) {

  return (
    <div className={styles.settingsLayout}>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
