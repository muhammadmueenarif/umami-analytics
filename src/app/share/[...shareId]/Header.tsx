import { Text } from 'react-basics';
import Link from 'next/link';
import Image from 'next/image';
import LanguageButton from '@/components/input/LanguageButton';
import ThemeButton from '@/components/input/ThemeButton';
import SettingsButton from '@/components/input/SettingsButton';
import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <div>
        <Link href="/" className={styles.title}>
          <Image
            src="/logo.png"
            alt="Hivefinty"
            width={32}
            height={32}
            className={styles.logoImage}
            priority
          />
          <Text>Hivefinty</Text>
        </Link>
      </div>
      <div className={styles.buttons}>
        <ThemeButton />
        <LanguageButton />
        <SettingsButton />
      </div>
    </header>
  );
}

export default Header;
