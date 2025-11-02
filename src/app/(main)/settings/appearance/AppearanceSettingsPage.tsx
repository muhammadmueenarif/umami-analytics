'use client';
import PageHeader from '@/components/layout/PageHeader';
import Icons from '@/components/icons';
import ColorPaletteSelector from './ColorPaletteSelector';
import styles from './AppearanceSettingsPage.module.css';

export default function AppearanceSettingsPage() {
  return (
    <>
      <PageHeader title="Appearance" icon={<Icons.Gear />} />
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.title}>Brand Customization</h2>
          <p className={styles.description}>Customize colors to match your brand identity.</p>
          <ColorPaletteSelector />
        </div>
      </div>
    </>
  );
}
