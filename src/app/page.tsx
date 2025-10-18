import type { Metadata } from 'next';
import MainApp from './main-app';

export const metadata: Metadata = {
  title: 'DeVOTE Pilot Scoping Terminal',
};

export default function Page() {
  return <MainApp />;
}
