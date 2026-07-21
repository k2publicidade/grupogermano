import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;
const Base = ({ children, ...props }: IconProps) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{children}</svg>;
export const ArrowIcon = (p: IconProps) => <Base {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Base>;
export const BagIcon = (p: IconProps) => <Base {...p}><path d="M6 8h12l-1 12H7L6 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></Base>;
export const MenuIcon = (p: IconProps) => <Base {...p}><path d="M4 7h16M4 12h16M4 17h16" /></Base>;
export const CloseIcon = (p: IconProps) => <Base {...p}><path d="m6 6 12 12M18 6 6 18" /></Base>;
export const CheckIcon = (p: IconProps) => <Base {...p}><path d="m5 12 4 4L19 6" /></Base>;
export const LockIcon = (p: IconProps) => <Base {...p}><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></Base>;
export const BoxIcon = (p: IconProps) => <Base {...p}><path d="m4 7 8-4 8 4-8 4-8-4Z" /><path d="m4 7 8 4v10l-8-4V7ZM20 7l-8 4v10l8-4V7Z" /></Base>;
export const ChartIcon = (p: IconProps) => <Base {...p}><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></Base>;
export const ShieldIcon = (p: IconProps) => <Base {...p}><path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-5" /></Base>;
export const SearchIcon = (p: IconProps) => <Base {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></Base>;
export const PlusIcon = (p: IconProps) => <Base {...p}><path d="M12 5v14M5 12h14" /></Base>;
export const MinusIcon = (p: IconProps) => <Base {...p}><path d="M5 12h14" /></Base>;
export const TrashIcon = (p: IconProps) => <Base {...p}><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13" /></Base>;
export const DownloadIcon = (p: IconProps) => <Base {...p}><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" /></Base>;
export const MailIcon = (p: IconProps) => <Base {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></Base>;
