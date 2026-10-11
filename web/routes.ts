export type WebRoute =
  | { readonly name: 'home' }
  | { readonly name: 'create' }
  | { readonly name: 'recipient'; readonly giftId: string }
  | { readonly name: 'admin' };

export function resolveWebRoute(pathname: string): WebRoute {
  const normalized = pathname.replace(/\/+$/, '') || '/';

  if (normalized === '/create') return { name: 'create' };
  if (normalized === '/admin') return { name: 'admin' };
  if (normalized.startsWith('/gift/')) {
    return { name: 'recipient', giftId: normalized.slice('/gift/'.length) || 'missing' };
  }
  if (normalized.startsWith('/recipient/')) {
    return { name: 'recipient', giftId: normalized.slice('/recipient/'.length) || 'preview' };
  }
  return { name: 'home' };
}

export function routeToPath(route: WebRoute): string {
  switch (route.name) {
    case 'create':
      return '/create';
    case 'recipient':
      return `/recipient/${encodeURIComponent(route.giftId)}`;
    case 'admin':
      return '/admin';
    case 'home':
      return '/';
  }
}
