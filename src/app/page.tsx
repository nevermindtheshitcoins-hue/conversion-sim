import type { Metadata } from 'next';
import ScopingTerminal from '../components/ScopingTerminal';

export const metadata: Metadata = {
  title: 'DeVOTE Pilot Scoping Terminal',
};

export default function Page() {
  return <ScopingTerminal />;
}
