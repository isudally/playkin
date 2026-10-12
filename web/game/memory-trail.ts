import type { GameModule, GameModuleContext, GameModuleEvent } from '../domain/game-module';

export type LanternStageKind = 'discover' | 'aim' | 'path' | 'collect' | 'assemble';

export interface LanternStage {
  readonly id: string;
  readonly chapter: string;
  readonly title: string;
  readonly story: string;
  readonly kind: LanternStageKind;
}

export interface MemoryTrailState {
  readonly status: 'ready' | 'playing' | 'completed';
  readonly stageIndex: number;
  readonly score: number;
  readonly sparks: number;
  readonly lanternPower: number;
  readonly selectedTargets: readonly string[];
  readonly aimValue: number;
  readonly stageComplete: boolean;
  readonly feedback: string | null;
  readonly lastActionCorrect: boolean | null;
}

const initialState: MemoryTrailState = {
  status: 'ready', stageIndex: 0, score: 0, sparks: 0, lanternPower: 0,
  selectedTargets: [], aimValue: 50, stageComplete: false, feedback: null, lastActionCorrect: null,
};

const stages: readonly LanternStage[] = [
  { id: 'wake', chapter: 'CHAPTER ONE · THE MEADOW', title: 'Wake the hidden sparks', story: 'Dodo knows the first light is hiding nearby. Look closely and tap the three sparks before they drift away.', kind: 'discover' },
  { id: 'bridge', chapter: 'CHAPTER TWO · THE BRIDGE', title: 'Guide the lantern beam', story: 'A bridge waits in the dark. Move the beam until it catches the golden arch, then let the light through.', kind: 'aim' },
  { id: 'path', chapter: 'CHAPTER THREE · THE PATH', title: 'Lead Dodo home', story: 'The valley is opening. Trace the path in the order the night reveals it: meadow, moon, bridge.', kind: 'path' },
  { id: 'keepsakes', chapter: 'CHAPTER FOUR · THE KEEPSAKES', title: 'Gather what matters', story: 'A few small memories are floating through the air. Bring the three that belong in this gift close to the lantern.', kind: 'collect' },
  { id: 'star', chapter: 'CHAPTER FIVE · THE LAST STAR', title: 'Assemble the last star', story: 'The trail ends where every little light belongs. Join the fragments and see what Dodo has been carrying for you.', kind: 'assemble' },
];

const stageTargets: Record<LanternStageKind, readonly string[]> = {
  discover: ['north', 'river', 'hill'], aim: [], path: ['meadow', 'moon', 'bridge'], collect: ['ribbon', 'shell', 'note'], assemble: ['one', 'two', 'three', 'four', 'five'],
};

export class MemoryTrailGame implements GameModule {
  readonly manifest = {
    id: 'dodos-memory-trail', version: '1.2.0' as const, title: "Dodo's Lantern Trail",
    description: 'A five-stage illustrated adventure where a personal gift becomes a light to carry home.',
    personalization: { required: ['recipientName', 'senderName', 'occasion'] as const, optional: ['message'] as const },
    theme: { supportedThemes: ['golden-reunion', 'eternal-romance', 'creator-wave'], requiredAssetRoles: ['companion', 'background', 'lantern', 'spark'] },
    difficulty: { levels: ['gentle'], defaultLevel: 'gentle' },
  };

  private context: GameModuleContext | null = null;
  private listeners = new Set<(event: GameModuleEvent) => void>();
  private state: MemoryTrailState = initialState;
  private paused = false;
  private occasion = 'birthday';
  private recipientName = '';

  mount(context: GameModuleContext) { this.context = context; this.occasion = context.input.occasion.replace('-', ' '); this.recipientName = context.input.recipientName; }
  start() { if (this.context) { this.paused = false; this.state = { ...initialState, status: 'playing' }; } }
  pause() { if (this.state.status === 'playing') this.paused = true; }
  resume() { if (this.state.status === 'playing') this.paused = false; }
  complete() { if (this.state.status !== 'completed') this.finish(); }
  abandon() { this.teardown(); }
  teardown() { this.context = null; this.paused = false; this.listeners.clear(); }
  subscribe(listener: (event: GameModuleEvent) => void) { this.listeners.add(listener); return () => this.listeners.delete(listener); }
  getState() { return this.state; }
  getCurrentStage() { return stages[this.state.stageIndex] ?? null; }
  getStageCount() { return stages.length; }
  getStageTargets() { return stageTargets[this.getCurrentStage()?.kind ?? 'discover']; }
  getOccasion() { return titleCase(this.occasion); }
  getRecipientName() { return this.recipientName; }

  discover(targetId: string) {
    if (!this.canAct('discover') || this.state.selectedTargets.includes(targetId)) return;
    const selectedTargets = [...this.state.selectedTargets, targetId];
    this.state = { ...this.state, selectedTargets, feedback: 'A spark joins the lantern.', lastActionCorrect: true };
    if (selectedTargets.length === this.getStageTargets().length) this.completeStage('The meadow remembers your touch.'); else this.emitProgress();
  }

  setAim(value: number) { if (this.canAct('aim')) this.state = { ...this.state, aimValue: Math.max(0, Math.min(100, Math.round(value))), feedback: null }; }

  lightBridge() {
    if (!this.canAct('aim')) return;
    if (Math.abs(this.state.aimValue - 72) <= 8) this.completeStage('The beam finds its way across the bridge.');
    else this.state = { ...this.state, feedback: 'The beam slips past the arch. Nudge it a little and try again.', lastActionCorrect: false };
  }

  tracePath(targetId: string) {
    if (!this.canAct('path')) return;
    const expected = this.getStageTargets()[this.state.selectedTargets.length];
    if (targetId !== expected) { this.state = { ...this.state, selectedTargets: [], feedback: 'The path loops back. Follow the newest light first.', lastActionCorrect: false }; return; }
    const selectedTargets = [...this.state.selectedTargets, targetId];
    this.state = { ...this.state, selectedTargets, feedback: 'The path brightens beneath Dodo’s feet.', lastActionCorrect: true };
    if (selectedTargets.length === this.getStageTargets().length) this.completeStage('The valley opens into a new clearing.'); else this.emitProgress();
  }

  collect(targetId: string) {
    if (!this.canAct('collect') || this.state.selectedTargets.includes(targetId)) return;
    const selectedTargets = [...this.state.selectedTargets, targetId];
    this.state = { ...this.state, selectedTargets, feedback: 'That belongs in the lantern.', lastActionCorrect: true };
    if (selectedTargets.length === this.getStageTargets().length) this.completeStage('The keepsakes begin to glow together.'); else this.emitProgress();
  }

  assemble(targetId: string) {
    if (!this.canAct('assemble')) return;
    const expected = this.getStageTargets()[this.state.selectedTargets.length];
    if (targetId !== expected) { this.state = { ...this.state, feedback: 'That fragment is still looking for its place.', lastActionCorrect: false }; return; }
    const selectedTargets = [...this.state.selectedTargets, targetId];
    this.state = { ...this.state, selectedTargets, feedback: 'The star is taking shape.', lastActionCorrect: true };
    if (selectedTargets.length === this.getStageTargets().length) this.completeStage('The last star is ready to open.'); else this.emitProgress();
  }

  continue() {
    if (this.state.status !== 'playing' || this.paused || !this.state.stageComplete) return;
    if (this.state.stageIndex === stages.length - 1) { this.finish(); return; }
    this.state = { ...this.state, stageIndex: this.state.stageIndex + 1, selectedTargets: [], aimValue: 50, stageComplete: false, feedback: null, lastActionCorrect: null };
    this.emitProgress();
  }

  private canAct(kind: LanternStageKind) { return this.state.status === 'playing' && !this.paused && !this.state.stageComplete && this.getCurrentStage()?.kind === kind; }
  private completeStage(feedback: string) { this.state = { ...this.state, stageComplete: true, score: this.state.score + 200, sparks: this.state.sparks + 2, lanternPower: Math.min(100, this.state.lanternPower + 20), feedback, lastActionCorrect: true }; this.emitProgress(); }
  private finish() { this.state = { ...this.state, status: 'completed', stageComplete: true, lanternPower: 100, feedback: 'The whole valley is glowing.' }; this.emit({ type: 'completed', moduleId: this.manifest.id, score: this.state.score, occurredAt: new Date().toISOString() }); }
  private emitProgress() { this.emit({ type: 'progress', moduleId: this.manifest.id, progress: (this.state.stageIndex + (this.state.stageComplete ? 1 : 0)) / stages.length, checkpoint: `${this.getCurrentStage()?.id}-${this.state.selectedTargets.length}`, occurredAt: new Date().toISOString() }); }
  private emit(event: GameModuleEvent) { this.context?.announceProgress(event.type === 'progress' ? event : { type: 'progress', moduleId: this.manifest.id, progress: 1, occurredAt: new Date().toISOString() }); if (event.type === 'completed') this.context?.announceCompletion(event); this.listeners.forEach((listener) => listener(event)); }
}

function titleCase(value: string) { return value.replace(/\b\w/g, (letter) => letter.toUpperCase()); }
