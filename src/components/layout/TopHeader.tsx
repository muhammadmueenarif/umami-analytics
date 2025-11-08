'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ThemeButton from '@/components/input/ThemeButton';
import LanguageButton from '@/components/input/LanguageButton';
import SearchBar from '@/components/common/SearchBar';
import { useLogin } from '@/components/hooks';
import { User, LogOut, Settings } from 'lucide-react';
import styles from './TopHeader.module.css';

export function TopHeader() {
  const { user } = useLogin();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const getInitials = (username: string) => {
    return username
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    router.push('/logout');
    setShowMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        {/* Logo/Menu can go here if needed */}
      </div>
      <div className={styles.centerSection}>
        <SearchBar />
      </div>
      <div className={styles.controls}>
        <LanguageButton />
        <ThemeButton />
        <div className={styles.profileContainer} ref={menuRef}>
          <button
            className={styles.profileButton}
            onClick={() => setShowMenu(!showMenu)}
            aria-label="User menu"
          >
            <div className={styles.profileAvatar}>
              {user?.username ? (
                <span className={styles.profileInitials}>{getInitials(user.username)}</span>
              ) : (
                <User size={20} />
              )}
            </div>
          </button>
          {showMenu && (
            <div className={styles.profileMenu}>
              <div className={styles.profileMenuHeader}>
                <div className={styles.profileMenuAvatar}>
                  {user?.username ? (
                    <span className={styles.profileMenuInitials}>{getInitials(user.username)}</span>
                  ) : (
                    <User size={24} />
                  )}
                </div>
                <div className={styles.profileMenuInfo}>
                  <div className={styles.profileMenuName}>{user?.username || 'User'}</div>
                  <div className={styles.profileMenuEmail}>{user?.email || ''}</div>
                </div>
              </div>
              <div className={styles.profileMenuDivider} />
              <button
                className={styles.profileMenuItem}
                onClick={() => {
                  router.push('/profile');
                  setShowMenu(false);
                }}
              >
                <User size={18} />
                <span>Profile</span>
              </button>
              <button
                className={styles.profileMenuItem}
                onClick={() => {
                  router.push('/settings');
                  setShowMenu(false);
                }}
              >
                <Settings size={18} />
                <span>Account settings</span>
              </button>
              <div className={styles.profileMenuDivider} />
              <button className={styles.profileMenuItem} onClick={handleLogout}>
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopHeader;

