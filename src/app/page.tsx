import OverviewPage from '@/components/Dashboard/OverView';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Irrigation System',
  description: 'This is Next.js Irrigation System',
};

export default function Home() {
  return (
    <DefaultLayout>
      <OverviewPage />
    </DefaultLayout>
  );
}
