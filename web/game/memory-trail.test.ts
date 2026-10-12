import { MemoryTrailGame } from './memory-trail';

function mountGame() {
  const game = new MemoryTrailGame();
  game.mount({ input: { giftId: 'gift-1', recipientName: 'Ari', senderName: 'Ismael', message: 'A little world.', occasion: 'birthday', themeId: 'golden-reunion', difficulty: 'gentle' }, announceProgress: () => undefined, announceCompletion: () => undefined });
  return game;
}

describe("Dodo's Lantern Trail", () => {
  it('mounts five distinct scene-led mechanics', () => {
    const game = mountGame();
    expect(game.getStageCount()).toBe(5);
    expect(game.getCurrentStage()?.kind).toBe('discover');
    game.start(); game.discover('north'); game.discover('river'); game.discover('hill'); game.continue();
    expect(game.getCurrentStage()?.kind).toBe('aim');
    game.setAim(72); game.lightBridge(); game.continue();
    expect(game.getCurrentStage()?.kind).toBe('path');
    game.teardown();
  });

  it('preserves progress across pause and resume', () => {
    const game = mountGame();
    game.start(); game.discover('north'); game.pause(); game.discover('river');
    expect(game.getState()).toMatchObject({ stageIndex: 0, sparks: 0, selectedTargets: ['north'], stageComplete: false });
    game.resume(); game.discover('river'); game.discover('hill');
    expect(game.getState()).toMatchObject({ stageIndex: 0, sparks: 2, stageComplete: true });
    game.teardown();
  });

  it('requires direct interactions in order and emits completion', () => {
    const game = mountGame(); const events: string[] = [];
    game.subscribe((event) => events.push(event.type)); game.start();
    ['north', 'river', 'hill'].forEach((target) => game.discover(target)); game.continue();
    game.setAim(72); game.lightBridge(); game.continue();
    game.tracePath('meadow'); game.tracePath('moon'); game.tracePath('bridge'); game.continue();
    ['ribbon', 'shell', 'note'].forEach((target) => game.collect(target)); game.continue();
    ['one', 'two', 'three', 'four', 'five'].forEach((target) => game.assemble(target)); game.continue();
    expect(game.getState()).toMatchObject({ status: 'completed', sparks: 10, lanternPower: 100 });
    expect(events[events.length - 1]).toBe('completed');
    game.teardown();
  });
});
