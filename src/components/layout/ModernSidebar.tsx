'use client';
import { useState } from 'react';
import { Icon, Text } from 'react-basics';
import Link from 'next/link';
import Image from 'next/image';
import classNames from 'classnames';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Globe, FileText, Menu, User, LogOut, Users, Palette, Settings, Building2, UserCircle } from 'lucide-react';
import { useMessages, useLogin, useTeamUrl, useTheme } from '@/components/hooks';
import ThemeButton from '@/components/input/ThemeButton';
import LanguageButton from '@/components/input/LanguageButton';
import styles from './ModernSidebar.module.css';

export function ModernSidebar() {
  const { formatMessage, labels } = useMessages();
  const { user } = useLogin();
  const pathname = usePathname();
  const router = useRouter();
  const { teamId, renderTeamUrl } = useTeamUrl();
  const { theme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const cloudMode = !!process.env.cloudMode;

  const navigationItems = [
    {
      key: 'dashboard',
      label: formatMessage(labels.dashboard),
      url: renderTeamUrl('/dashboard'),
      icon: <LayoutDashboard size={20} />,
    },
    {
      key: 'websites',
      label: formatMessage(labels.websites),
      url: renderTeamUrl('/websites'),
      icon: <Globe size={20} />,
    },
    {
      key: 'reports',
      label: formatMessage(labels.reports),
      url: renderTeamUrl('/reports'),
      icon: <FileText size={20} />,
    },
    {
      key: 'settings-websites',
      label: 'Website Settings',
      url: renderTeamUrl('/settings/websites'),
      icon: <Settings size={20} />,
    },
    {
      key: 'settings-teams',
      label: formatMessage(labels.teams),
      url: renderTeamUrl('/settings/teams'),
      icon: <Building2 size={20} />,
    },
    {
      key: 'settings-appearance',
      label: 'Appearance',
      url: renderTeamUrl('/settings/appearance'),
      icon: <Palette size={20} />,
    },
    user.isAdmin && {
      key: 'settings-users',
      label: 'User Management',
      url: '/settings/users',
      icon: <UserCircle size={20} />,
    },
  ].filter(n => n);

  const handleLogout = () => {
    router.push('/logout');
  };

  const getInitials = (username: string) => {
    return username
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <aside className={classNames(styles.sidebar, { [styles.collapsed]: isCollapsed })}>
      {/* Logo Section */}
      <div className={styles.logoSection}>
        <div className={styles.logo}>
          <Image 
            src="/logo.png" 
            alt="Logo" 
            width={32} 
            height={32} 
            className={styles.logoImage}
            priority
          />
          {!isCollapsed && <span className={styles.logoText}>hivefinty</span>}
        </div>
        <button
          className={styles.collapseButton}
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Menu size={20} />
        </button>
      </div>


      {/* Navigation Menu */}
      <nav className={styles.nav}>
        {navigationItems.map((item) => {
          const isActive = pathname.startsWith(item.url);
          return (
            <Link
              key={item.key}
              href={item.url}
              className={classNames(styles.navItem, {
                [styles.active]: isActive,
              })}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {!isCollapsed && <span className={styles.navLabel}>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className={styles.profileSection}>
        {!isCollapsed && (
          <div className={styles.profileActions}>
            <Link href="/profile" className={styles.profileLink}>
              <User size={20} />
              <span className={styles.navLabel}>Profile</span>
            </Link>
            {!cloudMode && (
              <button onClick={handleLogout} className={styles.logoutButton}>
                <LogOut size={20} />
                <span className={styles.navLabel}>Logout</span>
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}

export default ModernSidebar;

