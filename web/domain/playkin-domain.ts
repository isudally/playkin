export type GiftOccasion = 'birthday' | 'anniversary' | 'thank-you' | 'just-because';
export type GiftTheme = 'golden-reunion' | 'eternal-romance' | 'creator-wave';

export interface GiftDraft {
  readonly id: string;
  readonly recipientName: string;
  readonly senderName: string;
  readonly occasion: GiftOccasion;
  readonly message: string;
  readonly themeId: GiftTheme;
  readonly createdAt: string;
}

export type GiftStatus = 'draft' | 'published' | 'completed';

export interface GiftCompletion {
  readonly score: number;
  readonly completedAt: string;
}

export interface GiftRecord extends GiftDraft {
  readonly status: GiftStatus;
  readonly progress: number;
  readonly expiresAt: string;
  readonly openedAt: string | null;
  readonly interactedAt: string | null;
  readonly completion: GiftCompletion | null;
}

export interface GiftPersistence {
  saveDraft(draft: GiftDraft): Promise<void>;
  getDraft(id: string): Promise<GiftDraft | null>;
  publishDraft(id: string): Promise<{ giftId: string }>;
}

export interface RecipientLinkService {
  issuePreviewLink(giftId: string): Promise<string>;
  resolveRecipientLink(token: string): Promise<{ giftId: string } | null>;
}

export interface ServerAiGateway {
  createGiftDraft(input: Pick<GiftDraft, 'recipientName' | 'occasion' | 'message'>): Promise<GiftDraft>;
}

export interface PaymentGateway {
  createCheckout(input: { giftId: string; returnUrl: string }): Promise<{ checkoutUrl: string }>;
}

export interface MediaStorage {
  createUpload(input: { filename: string; contentType: string }): Promise<{ uploadUrl: string }>;
}

export interface AnalyticsTracker {
  track(event: { name: string; properties?: Record<string, string | number | boolean> }): void;
}

export const integrationStatus = {
  giftPersistence: 'Phase 1C versioned local server store with migration and deletion boundary',
  recipientLinks: 'Phase 1B hashed opaque expiring tokens',
  serverAi: 'Phase 1B server-only boundary, provider not configured',
  payments: 'reserved for commercial entitlement work',
  uploads: 'reserved for media storage boundary',
  analytics: 'reserved for host-controlled event tracking',
} as const;
