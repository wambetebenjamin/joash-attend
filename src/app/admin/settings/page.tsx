import SettingsPanel from '@/components/dashboard/SettingsPanel';
import { getSettings } from '@/lib/repository';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Organisation settings' };

export default async function SettingsPage() {
  const settings = await getSettings();
  return <SettingsPanel initialSettings={settings} />;
}
