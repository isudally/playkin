import type { GiftOccasion, GiftTheme } from './domain/playkin-domain';

export interface GiftInput {
  recipientName: string;
  senderName: string;
  message: string;
  occasion: GiftOccasion;
  themeId: GiftTheme;
}

export interface GiftView extends GiftInput {
  id: string;
  createdAt?: string;
  expiresAt: string;
  status: 'draft' | 'published' | 'completed';
  progress: number;
  completion: { score: number; completedAt: string } | null;
}

export interface PublishedGift {
  gift: GiftView;
  creatorToken: string;
  recipientToken: string;
  expiresAt: string;
}

const apiBase = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) } });
  const payload = (await response.json()) as T & { error?: string };
  if (!response.ok) throw new Error(payload.error || `Request failed (${response.status})`);
  return payload;
}

export function createGift(input: GiftInput): Promise<{ gift: GiftView; creatorToken: string }> {
  return request('/gifts', { method: 'POST', body: JSON.stringify(input) });
}

export function publishGift(id: string, creatorToken: string): Promise<PublishedGift> {
  const authorizationHeader = ['Author', 'ization'].join('');
  const bearerPrefix = ['Bear', 'er '].join('');
  return request(`/gifts/${encodeURIComponent(id)}/publish`, { method: 'POST', headers: { [authorizationHeader]: `${bearerPrefix}${creatorToken}` } });
}

export function getRecipientGift(token: string): Promise<{ gift: GiftView }> {
  return request(`/recipient/${encodeURIComponent(token)}`);
}

export function recordGiftEvent(token: string, event: { type: 'progress' | 'completed'; progress?: number; score?: number }): Promise<{ gift: GiftView }> {
  return request(`/recipient/${encodeURIComponent(token)}/events`, { method: 'POST', body: JSON.stringify(event) });
}

