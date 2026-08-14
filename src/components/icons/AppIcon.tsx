export type AppIconName =
  | 'dashboard' | 'applications' | 'followUps' | 'plus' | 'search'
  | 'filter' | 'list' | 'board' | 'calendar' | 'edit' | 'trash'
  | 'externalLink' | 'check' | 'close' | 'menu' | 'logout' | 'chevronDown' | 'mapPin' | 'sun' | 'moon'

interface AppIconProps {
  name: AppIconName
  className?: string
}

const paths: Record<AppIconName, React.ReactNode> = {
  dashboard: <><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /></>,
  applications: <><path d="M9 6V4h6v2" /><rect x="3" y="6" width="18" height="14" rx="2" /><path d="M3 12h18M9 12v2h6v-2" /></>,
  followUps: <><path d="M7 3v3m10-3v3M4 9h16" /><rect x="4" y="5" width="16" height="16" rx="2" /><path d="m9 15 2 2 4-4" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="m16 16 4 4" /></>,
  filter: <path d="M4 5h16l-6 7v5l-4 2v-7L4 5Z" />,
  list: <><path d="M9 6h11M9 12h11M9 18h11" /><circle cx="4.5" cy="6" r=".5" fill="currentColor" /><circle cx="4.5" cy="12" r=".5" fill="currentColor" /><circle cx="4.5" cy="18" r=".5" fill="currentColor" /></>,
  board: <><rect x="3" y="4" width="7" height="16" rx="1" /><rect x="14" y="4" width="7" height="10" rx="1" /></>,
  calendar: <><path d="M7 3v3m10-3v3M4 9h16" /><rect x="4" y="5" width="16" height="16" rx="2" /></>,
  edit: <><path d="m14 5 5 5M4 20l3.5-.8L19 7.7a2.1 2.1 0 0 0-3-3L4.8 16.2 4 20Z" /></>,
  trash: <><path d="M4 7h16M9 7V4h6v3m3 0-1 13H7L6 7m4 4v5m4-5v5" /></>,
  externalLink: <><path d="M14 4h6v6m0-6-9 9" /><path d="M19 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h6" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  logout: <><path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4m5-4 3-3-3-3m3 3H9" /></>,
  chevronDown: <path d="m7 9 5 5 5-5" />,
  mapPin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  moon: <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z" />,
}

export function AppIcon({ name, className }: AppIconProps) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}
