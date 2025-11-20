import { CURRENT_VERSION } from '@/lib/constants';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <a href="/">
        <b>Hivefinty</b> {CURRENT_VERSION && `v${CURRENT_VERSION}`}
      </a>
    </footer>
  );
}

export default Footer;
