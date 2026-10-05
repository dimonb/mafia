import type { ReactNode } from 'react';
import type { RoleId } from '../types/game';

const paths: Record<RoleId, ReactNode> = {
  civilian: <><path d="m3 10 9-7 9 7v10H3Z" /><path d="M9 20v-8h6v8" /></>,
  mafia: <><path d="M3 8c3 2 5 2 9 2s6 0 9-2v5c0 5-4 7-9 4-5 3-9 1-9-4Z" /><path d="m6 12 3 1m6 0 3-1" /></>,
  don: <><path d="m3 6 4 4 5-7 5 7 4-4-2 12H5Z" /><path d="M5 21h14" /></>,
  sheriff: <path d="m12 3 2.8 5.8 6.4.9-4.6 4.5 1.1 6.4-5.7-3-5.7 3 1.1-6.4L3.2 9.7l6.4-.9Z" />,
  doctor: <><path d="M20.5 5.5a5 5 0 0 0-8.5 2 5 5 0 0 0-8.5-2c-4 4 0 9 8.5 15 8.5-6 12.5-11 8.5-15Z" /><path d="M5 12h4l2-3 2 6 2-3h4" /></>,
  lucky: <><path d="M12 12C2 13 1 5 6 4c4-2 6 2 6 8Zm0 0c-1-10 7-11 8-6 2 4-2 6-8 6Zm0 0c10-1 11 7 6 8-4 2-6-2-6-8Zm0 0c1 10-7 11-8 6-2-4 2-6 8-6Z" /></>,
  maniac: <><path d="m4 3 16 16m0-16L4 19M3 16l5 5m8-5 5 5M4 3v5m16-5v5" /></>,
  suicide_bomber: <><circle cx="11" cy="14" r="7" /><path d="m15 8 2-3 3 1m-1-3 2-2M4 3l2 2" /></>,
  werewolf: <path d="M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z" />,
  lawyer: <><path d="M12 3v18m-6 0h12M4 7h16M6 7l-4 8h8Zm12 0-4 8h8Z" /></>,
};

export default function RoleIcon({ roleId }: { roleId: RoleId }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[roleId]}</svg>;
}
