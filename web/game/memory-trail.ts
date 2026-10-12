import type { GameModule, GameModuleContext, GameModuleEvent } from '../domain/game-module';

export interface MemoryTrailRound {
  readonly prompt: string;
  readonly options: readonly { id: string; label: string }[];
  readonly answerId: string;
}

export interface MemoryTrailState {
  readonly status: 'ready' | 'playing' | 'completed';
  readonly roundIndex: number;
  readonly score: number;
  readonly selectedAnswer: string | null;
  readonly lastAnswerCorrect: boolean | null;
  readonly awaitingNext: boolean;
}

export class MemoryTrailGame implements GameModule {
  readonly manifest = {
    id: 'dodos-memory-trail',
    version: '1.0.0' as const,
    title: "Dodo's Memory Trail",
    description: 'Three small clues carry a personal gift from sender to recipient.',
    personalization: { required: ['recipientName', 'senderName', 'occasion'] as const, optional: ['message'] as const },
    theme: { supportedThemes: ['golden-reunion', 'eternal-romance', 'creator-wave'], requiredAssetRoles: ['companion', 'background'] },
    difficulty: { levels: ['gentle'], defaultLevel: 'gentle' },
  };

  private context: GameModuleContext | null = null;
  private listeners = new Set<(event: GameModuleEvent) => void>();
  private state: MemoryTrailState = { status: 'ready', roundIndex: 0, score: 0, selectedAnswer: null, lastAnswerCorrect: null, awaitingNext: false };
  private rounds: MemoryTrailRound[] = [];

  mount(context: GameModuleContext) {
    this.context = context;
    const occasion = context.input.occasion.replace('-', ' ');
    this.rounds = [
      { prompt: 'What is the little world celebrating?', options: [{ id: 'occasion', label: titleCase(occasion) }, { id: 'ordinary-day', label: 'An ordinary Tuesday' }, { id: 'weather', label: 'A weather report' }], answerId: 'occasion' },
      { prompt: 'Who sent this little world your way?', options: [{ id: 'dodo', label: 'A curious dodo' }, { id: 'sender', label: context.input.senderName }, { id: 'delivery', label: 'The delivery desk' }], answerId: 'sender' },
      { prompt: 'What should you carry with you from this little world?', options: [{ id: 'message', label: 'A little piece of this moment' }, { id: 'ad', label: 'Please review this advertisement' }, { id: 'receipt', label: 'Your receipt is attached' }], answerId: 'message' },
    ];
  }

  start() { if (this.context) this.state = { ...this.state, status: 'playing' }; }
  pause() {}
  resume() { if (this.state.status === 'playing') this.start(); }
  complete() { if (this.state.status !== 'completed') this.finish(); }
  abandon() { this.teardown(); }
  teardown() { this.context = null; this.listeners.clear(); }
  subscribe(listener: (event: GameModuleEvent) => void) { this.listeners.add(listener); return () => this.listeners.delete(listener); }
  getState() { return this.state; }
  getCurrentRound() { return this.rounds[this.state.roundIndex] ?? null; }

  chooseAnswer(answerId: string) {
    if (this.state.status !== 'playing' || this.state.awaitingNext) return;
    const round = this.getCurrentRound();
    if (!round) return;
    const correct = round.answerId === answerId;
    const nextScore = this.state.score + (correct ? 100 : 25);
    this.state = { ...this.state, score: nextScore, selectedAnswer: answerId, lastAnswerCorrect: correct, awaitingNext: true };
    this.emit({ type: 'progress', moduleId: this.manifest.id, progress: (this.state.roundIndex + 1) / this.rounds.length, checkpoint: `round-${this.state.roundIndex + 1}-answered`, occurredAt: new Date().toISOString() });
  }

  continue() {
    if (this.state.status !== 'playing' || !this.state.awaitingNext) return;
    const isLast = this.state.roundIndex === this.rounds.length - 1;
    if (isLast) {
      this.finish();
      return;
    }
    this.state = { ...this.state, roundIndex: this.state.roundIndex + 1, selectedAnswer: null, lastAnswerCorrect: null, awaitingNext: false };
  }

  private finish() {
    this.state = { ...this.state, status: 'completed', awaitingNext: false };
    this.emit({ type: 'completed', moduleId: this.manifest.id, score: this.state.score, occurredAt: new Date().toISOString() });
  }

  private emit(event: GameModuleEvent) {
    this.context?.announceProgress(event.type === 'progress' ? event : { type: 'progress', moduleId: this.manifest.id, progress: 1, occurredAt: new Date().toISOString() });
    if (event.type === 'completed') this.context?.announceCompletion(event);
    this.listeners.forEach((listener) => listener(event));
  }
}

function titleCase(value: string) { return value.replace(/\b\w/g, (letter) => letter.toUpperCase()); }
