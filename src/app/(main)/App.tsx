'use client';
import { Loading } from 'react-basics';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useLogin, useConfig } from '@/components/hooks';

export function App({ children }) {
  const { user, isLoading, error } = useLogin();
  const config = useConfig();
  const pathname = usePathname();

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    window.location.href = `${process.env.basePath || ''}/login`;
  }

  if (!user || !config) {
    return null;
  }

  return (
    <>
      {children}
      {process.env.NODE_ENV === 'production' && !pathname.includes('/share/') && (
        <Script src={`${process.env.basePath || ''}/telemetry.js`} />
      )}
    </>
  );
}

export default App;
