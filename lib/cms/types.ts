export type ContentStatus = 'published' | 'draft';
export type ContentType = 'text' | 'textarea' | 'image' | 'url';

export type ContentEntry = {
  id: string;
  key: string;
  group: string;
  label: string;
  type: ContentType;
  value: string;
  status: ContentStatus;
  updatedAt: string;
};

export type MediaItem = {
  id: string;
  name: string;
  url: string;
  alt: string;
  width?: number;
  height?: number;
  createdAt: string;
};

export type FormSubmission = {
  id: string;
  form: string;
  data: Record<string, string>;
  status: 'new' | 'contacted' | 'archived';
  createdAt: string;
};

export type AuditEvent = {
  id: string;
  action: string;
  resource: string;
  createdAt: string;
};

export type CmsDocument = {
  content: ContentEntry[];
  media: MediaItem[];
  products: Product[];
  submissions: FormSubmission[];
  audit: AuditEvent[];
};
import type { Product } from '@/lib/data';
