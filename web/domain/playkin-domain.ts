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
  giftPersistence: 'reserved for Phase 1B server implementation',
  recipientLinks: 'reserved for Phase 1B opaque expiring tokens',
  serverAi: 'reserved for server-only provider credentials',
  payments: 'reserved for commercial entitlement work',
  uploads: 'reserved for media storage boundary',
  analytics: 'reserved for host-controlled event tracking',
} as const;
