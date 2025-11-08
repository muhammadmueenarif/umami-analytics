import { Metadata } from 'next';
import App from './App';
import ModernSidebar from '@/components/layout/ModernSidebar';
import TopHeader from '@/components/layout/TopHeader';
import Page from '@/components/layout/Page';
import styles from './layout.module.css';

export default async function ({ children }) {
  return (
    <App>
      <main className={styles.layout}>
        <ModernSidebar />
        <TopHeader />
        <section className={styles.body}>
          <Page>{children}</Page>
        </section>
      </main>
    </App>
  );
}

export const metadata: Metadata = {
  title: {
    template: '%s | hivefinty',
    default: 'hivefinty',
  },
};
