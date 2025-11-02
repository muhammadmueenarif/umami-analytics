import { Metadata } from 'next';
import AppearanceSettingsPage from './AppearanceSettingsPage';

export default async function () {
  return <AppearanceSettingsPage />;
}

export const metadata: Metadata = {
  title: 'Appearance',
};
