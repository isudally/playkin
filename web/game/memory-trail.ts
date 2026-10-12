import type { GameModule, GameModuleContext, GameModuleEvent } from '../domain/game-module';

export interface MemoryTrailRound {
  readonly chapter: string;
  readonly prompt: string;
  readonly detail: string;
  readonly options: readonly { id: string; label: string }[];
  readonly answerId: string;
}

export interface MemoryTrailState {
  readonly status: 'ready' | 'playing' | 'completed';
  readonly roundIndex: number;
  readonly score: number;
  readonly sparks: number;
  readonly selectedAnswer: string | null;
  readonly lastAnswerCorrect: boolean | null;
  readonly awaitingNext: boolean;
}

const initialState: MemoryTrailState = {
  status: 'ready', roundIndex: 0, score: 0, sparks: 0, selectedAnswer: null, lastAnswerCorrect: null, awaitingNext: false,
};

export class MemoryTrailGame implements GameModule {
  readonly manifest = {
    id: 'dodos-memory-trail',
    version: '1.1.0' as const,
    title: "Dodo's Lantern Trail",
    description: 'Five small acts of attention turn a personal gift into a glowing memory.',
    personalization: { required: ['recipientName', 'senderName', 'occasion'] as const, optional: ['message'] as const },
    theme: { supportedThemes: ['golden-reunion', 'eternal-romance', 'creator-wave'], requiredAssetRoles: ['companion', 'background', 'lantern', 'spark'] },
    difficulty: { levels: ['gentle'], defaultLevel: 'gentle' },
  };

  private context: GameModuleContext | null = null;
  private listeners = new Set<(event: GameModuleEvent) => void>();
  private state: MemoryTrailState = initialState;
  private rounds: MemoryTrailRound[] = [];
  private paused = false;

  mount(context: GameModuleContext) {
    this.context = context;
    const occasion = context.input.occasion.replace('-', ' ');
    const sender = context.input.senderName;
    this.rounds = [
      { chapter: 'THE FIRST LIGHT', prompt: 'Which light feels like the beginning of a celebration?', detail: `The trail wakes around ${context.input.recipientName}. Choose the light that belongs to this moment.`, options: [{ id: 'occasion', label: titleCase(occasion) }, { id: 'ordinary-day', label: 'An ordinary Tuesday' }, { id: 'weather', label: 'A weather report' }], answerId: 'occasion' },
      { chapter: 'A FRIEND IN THE DARK', prompt: 'A small companion is waiting at the edge of the path. Who sent it?', detail: 'Some gifts begin with a person who knows exactly when to make a little magic.', options: [{ id: 'dodo', label: 'A curious dodo' }, { id: 'sender', label: sender }, { id: 'delivery', label: 'The delivery desk' }], answerId: 'sender' },
      { chapter: 'THE WARM POCKET', prompt: 'What would you carry through a quiet moment?', detail: 'The right answer is not the grandest one. It is the one that still feels warm when nobody is watching.', options: [{ id: 'memory', label: 'A little piece of this moment' }, { id: 'noise', label: 'A louder, busier day' }, { id: 'receipt', label: 'A receipt in a pocket' }], answerId: 'memory' },
      { chapter: 'THE GLOW BETWEEN', prompt: 'When the world gets noisy, what keeps this light bright?', detail: `Think of the feeling behind ${sender}'s gift, not the things around it.`, options: [{ id: 'message', label: 'A message meant only for you' }, { id: 'ad', label: 'A little more noise' }, { id: 'shortcut', label: 'A shortcut through the dark' }], answerId: 'message' },
      { chapter: 'THE LAST STAR', prompt: 'Where should the final star settle?', detail: 'You have carried the lantern all the way here. Place the last spark somewhere it can stay.', options: [{ id: 'here', label: 'Here, with me' }, { id: 'drawer', label: 'In a drawer' }, { id: 'far-away', label: 'Somewhere far away' }], answerId: 'here' },
    ];
  }

  start() { if (this.context) { this.paused = false; this.state = { ...initialState, status: 'playing' }; } }
  pause() { if (this.state.status === 'playing') this.paused = true; }
  resume() { if (this.state.status === 'playing') this.paused = false; }
  complete() { if (this.state.status !== 'completed') this.finish(); }
  abandon() { this.teardown(); }
  teardown() { this.context = null; this.paused = false; this.listeners.clear(); }
  subscribe(listener: (event: GameModuleEvent) => void) { this.listeners.add(listener); return () => this.listeners.delete(listener); }
  getState() { return this.state; }
  getCurrentRound() { return this.rounds[this.state.roundIndex] ?? null; }
  getRoundCount() { return this.rounds.length; }

  chooseAnswer(answerId: string) {
    if (this.state.status !== 'playing' || this.paused || this.state.awaitingNext) return;
    const round = this.getCurrentRound();
    if (!round) return;
    const correct = round.answerId === answerId;
    const nextScore = this.state.score + (correct ? 150 : 50);
    this.state = { ...this.state, score: nextScore, sparks: this.state.sparks + (correct ? 2 : 1), selectedAnswer: answerId, lastAnswerCorrect: correct, awaitingNext: true };
    this.emit({ type: 'progress', moduleId: this.manifest.id, progress: (this.state.roundIndex + 1) / this.rounds.length, checkpoint: `chapter-${this.state.roundIndex + 1}-answered`, occurredAt: new Date().toISOString() });
  }

  continue() {
    if (this.state.status !== 'playing' || this.paused || !this.state.awaitingNext) return;
    if (this.state.roundIndex === this.rounds.length - 1) { this.finish(); return; }
    this.state = { ...this.state, roundIndex: this.state.roundIndex + 1, selectedAnswer: null, lastAnswerCorrect: null, awaitingNext: false };
    this.emit({ type: 'progress', moduleId: this.manifest.id, progress: (this.state.roundIndex + 1) / this.rounds.length, checkpoint: `chapter-${this.state.roundIndex + 1}-opened`, occurredAt: new Date().toISOString() });
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
