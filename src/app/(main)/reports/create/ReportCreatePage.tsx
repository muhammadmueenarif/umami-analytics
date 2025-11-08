'use client';
import ReportTemplates from './ReportTemplates';
import styles from './ReportCreatePage.module.css';

export default function ReportCreatePage() {
  return (
    <div className={styles.createPage}>
      <ReportTemplates />
    </div>
  );
}
