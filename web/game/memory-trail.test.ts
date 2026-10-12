import { MemoryTrailGame } from './memory-trail';

function mountGame() {
  const game = new MemoryTrailGame();
  game.mount({
    input: { giftId: 'gift-1', recipientName: 'Ari', senderName: 'Ismael', message: 'A little world.', occasion: 'birthday', themeId: 'golden-reunion', difficulty: 'gentle' },
    announceProgress: () => undefined,
    announceCompletion: () => undefined,
  });
  return game;
}

describe('Dodo\'s Lantern Trail', () => {
  it('mounts a five-chapter personalized adventure', () => {
    const game = mountGame();

    expect(game.manifest.title).toBe("Dodo's Lantern Trail");
    expect(game.getRoundCount()).toBe(5);
    expect(game.getCurrentRound()?.options[0].label).toBe('Birthday');

    game.teardown();
  });

  it('preserves progress across pause and resume', () => {
    const game = mountGame();
    game.start();
    game.chooseAnswer('occasion');
    game.continue();
    game.pause();
    game.chooseAnswer('sender');

    expect(game.getState()).toMatchObject({ roundIndex: 1, score: 150, selectedAnswer: null, awaitingNext: false });

    game.resume();
    game.chooseAnswer('sender');
    expect(game.getState()).toMatchObject({ roundIndex: 1, score: 300, selectedAnswer: 'sender', awaitingNext: true });

    game.teardown();
  });

  it('emits completion after the final chapter', () => {
    const game = mountGame();
    const events: string[] = [];
    game.subscribe((event) => events.push(event.type));
    game.start();

    for (const answer of ['occasion', 'sender', 'memory', 'message', 'here']) {
      game.chooseAnswer(answer);
      game.continue();
    }

    expect(game.getState()).toMatchObject({ status: 'completed', roundIndex: 4, score: 750, sparks: 10 });
    expect(events[events.length - 1]).toBe('completed');

    game.teardown();
  });
});
