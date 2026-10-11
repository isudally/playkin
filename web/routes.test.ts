import { resolveWebRoute, routeToPath } from './routes';

describe('independent web routes', () => {
  it('resolves creator, recipient, and admin boundaries', () => {
    expect(resolveWebRoute('/')).toEqual({ name: 'home' });
    expect(resolveWebRoute('/create')).toEqual({ name: 'create' });
    expect(resolveWebRoute('/recipient/local-preview')).toEqual({ name: 'recipient', giftId: 'local-preview' });
    expect(resolveWebRoute('/gift/opaque-token')).toEqual({ name: 'recipient', giftId: 'opaque-token' });
    expect(resolveWebRoute('/admin')).toEqual({ name: 'admin' });
  });

  it('round-trips route paths', () => {
    expect(routeToPath({ name: 'home' })).toBe('/');
    expect(routeToPath({ name: 'recipient', giftId: 'local preview' })).toBe('/recipient/local%20preview');
  });
});
