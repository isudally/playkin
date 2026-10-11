export type GameModuleVersion = `${number}.${number}.${number}`;

export type PersonalizationField =
  | 'recipientName'
  | 'senderName'
  | 'message'
  | 'occasion'
  | 'relationship';

export interface GameModuleManifest {
  readonly id: string;
  readonly version: GameModuleVersion;
  readonly title: string;
  readonly description: string;
  readonly personalization: Readonly<{
    required: readonly PersonalizationField[];
    optional: readonly PersonalizationField[];
  }>;
  readonly theme: Readonly<{
    supportedThemes: readonly string[];
    requiredAssetRoles: readonly string[];
  }>;
  readonly difficulty: Readonly<{
    levels: readonly string[];
    defaultLevel: string;
  }>;
}

export interface GameModuleInput {
  readonly giftId: string;
  readonly recipientName: string;
  readonly senderName: string;
  readonly message?: string;
  readonly themeId: string;
  readonly difficulty: string;
}

export interface GameModuleContext {
  readonly input: GameModuleInput;
  readonly announceProgress: (event: GameModuleProgressEvent) => void;
  readonly announceCompletion: (event: GameModuleCompletionEvent) => void;
}

export interface GameModuleProgressEvent {
  readonly type: 'progress';
  readonly moduleId: string;
  readonly progress: number;
  readonly checkpoint?: string;
  readonly occurredAt: string;
}

export interface GameModuleCompletionEvent {
  readonly type: 'completed' | 'abandoned';
  readonly moduleId: string;
  readonly score?: number;
  readonly occurredAt: string;
}

export type GameModuleEvent = GameModuleProgressEvent | GameModuleCompletionEvent;

export interface GameModule {
  readonly manifest: GameModuleManifest;
  mount(context: GameModuleContext): Promise<void> | void;
  start(): void;
  pause(): void;
  resume(): void;
  complete(): void;
  abandon(): void;
  teardown(): void;
  subscribe(listener: (event: GameModuleEvent) => void): () => void;
}
