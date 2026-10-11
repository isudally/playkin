import { useCallback, useEffect, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { temporaryAssetNote } from './theme';
import type { GiftDraft, GiftOccasion, GiftTheme } from './domain/playkin-domain';
import { resolveWebRoute, routeToPath, type WebRoute } from './routes';

const DRAFT_KEY = 'playkin.phase1a.draft';

const occasions: readonly { id: GiftOccasion; label: string }[] = [
  { id: 'birthday', label: 'Birthday' },
  { id: 'anniversary', label: 'Anniversary' },
  { id: 'thank-you', label: 'Thank you' },
  { id: 'just-because', label: 'Just because' },
];

const themes: readonly { id: GiftTheme; label: string; color: string }[] = [
  { id: 'golden-reunion', label: 'Golden reunion', color: '#fbbf24' },
  { id: 'eternal-romance', label: 'Eternal romance', color: '#ec4899' },
  { id: 'creator-wave', label: 'Creator wave', color: '#6366f1' },
];

function createDraft(input: Omit<GiftDraft, 'id' | 'createdAt'>): GiftDraft {
  return { ...input, id: 'local-preview', createdAt: new Date().toISOString() };
}

function useWebNavigation() {
  const [route, setRoute] = useState<WebRoute>(() => resolveWebRoute(window.location.pathname));

  useEffect(() => {
    const onPopState = () => setRoute(resolveWebRoute(window.location.pathname));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback((nextRoute: WebRoute) => {
    window.history.pushState({}, '', routeToPath(nextRoute));
    setRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return { route, navigate };
}

export default function App() {
  const { route, navigate } = useWebNavigation();
  const [draft, setDraft] = useState<GiftDraft | null>(() => {
    try {
      const value = window.localStorage.getItem(DRAFT_KEY);
      return value ? (JSON.parse(value) as GiftDraft) : null;
    } catch {
      return null;
    }
  });

  const saveDraft = useCallback((nextDraft: GiftDraft) => {
    setDraft(nextDraft);
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(nextDraft));
  }, []);

  return (
    <div className="app-shell">
      <Navigation route={route} navigate={navigate} />
      {route.name === 'home' && <HomeRoute draft={draft} navigate={navigate} />}
      {route.name === 'create' && <CreateRoute saveDraft={saveDraft} navigate={navigate} />}
      {route.name === 'recipient' && <RecipientRoute draft={draft} navigate={navigate} />}
      {route.name === 'admin' && <AdminRoute navigate={navigate} />}
    </div>
  );
}

function Navigation({ route, navigate }: { route: WebRoute; navigate: (route: WebRoute) => void }) {
  return (
    <header className="site-header">
      <nav className="nav-bar" aria-label="Primary navigation">
        <button className="brand" type="button" onClick={() => navigate({ name: 'home' })} aria-label="Playkin home">
          playkin<span>.</span>
        </button>
        <div className="nav-links">
          <NavLink active={route.name === 'home'} label="Discover" onClick={() => navigate({ name: 'home' })} />
          <NavLink active={route.name === 'create'} label="Create a gift" onClick={() => navigate({ name: 'create' })} />
          <NavLink active={route.name === 'admin'} label="Admin" onClick={() => navigate({ name: 'admin' })} />
        </div>
        <span className="nav-badge">Web foundation</span>
      </nav>
    </header>
  );
}

function NavLink({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return <button className={`nav-link${active ? ' is-active' : ''}`} type="button" onClick={onClick}>{label}</button>;
}

function Page({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: ReactNode }) {
  return (
    <main className="page">
      <div className="page-intro"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="page-description">{description}</p></div>
      {children}
    </main>
  );
}

function HomeRoute({ draft, navigate }: { draft: GiftDraft | null; navigate: (route: WebRoute) => void }) {
  return (
    <Page eyebrow="THE PLAYKIN WEB FOUNDATION" title="Make a little magic for someone you love." description="A premium home for thoughtful, playable gifts — starting with a creator flow that keeps the human feeling at the centre.">
      <div className="hero-grid">
        <section className="hero-card"><p className="kicker">A new kind of gift</p><h2>Small moments deserve a world of their own.</h2><p>Shape a personal idea, choose a mood, and preview the recipient experience. Publishing and payment are intentionally not available in this foundation release.</p><div className="action-row"><PrimaryButton label="Create a gift" onClick={() => navigate({ name: 'create' })} /><SecondaryButton label="See recipient view" onClick={() => navigate({ name: 'recipient', giftId: draft?.id ?? 'preview' })} /></div></section>
        <aside className="dodo-card"><span className="dodo" aria-hidden="true">🦤</span><h2>Dodo is keeping watch</h2><p>A temporary development character while the final brand artwork is being prepared.</p></aside>
      </div>
      <section className="feature-section"><h2>Designed for the journey</h2><div className="feature-grid"><FeatureCard index="01" title="Create with feeling" body="A guided questionnaire turns a relationship, occasion, and message into a clear gift draft." /><FeatureCard index="02" title="Hand over with delight" body="The recipient view is a separate route, ready for secure delivery and interactive modules." /><FeatureCard index="03" title="Grow without rewrites" body="Host-controlled contracts keep persistence, AI, entitlements, and analytics outside the experience module." /></div></section>
      <Notice>{temporaryAssetNote}</Notice>
    </Page>
  );
}

function CreateRoute({ saveDraft, navigate }: { saveDraft: (draft: GiftDraft) => void; navigate: (route: WebRoute) => void }) {
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [occasion, setOccasion] = useState<GiftOccasion>('birthday');
  const [themeId, setThemeId] = useState<GiftTheme>('golden-reunion');
  const [saved, setSaved] = useState(false);
  const canPreview = recipientName.trim().length > 0 && senderName.trim().length > 0;

  const onSave = (event: FormEvent) => {
    event.preventDefault();
    if (!canPreview) return;
    saveDraft(createDraft({ recipientName: recipientName.trim(), senderName: senderName.trim(), occasion, message: message.trim(), themeId }));
    setSaved(true);
  };

  return (
    <Page eyebrow="CREATE A GIFT" title="Start with the person, not a template." description="This local development draft stays in your browser. Server persistence, secure links, and publishing arrive in Phase 1B.">
      <form className="form-card" onSubmit={onSave}>
        <FormField label="Who is this for?" value={recipientName} onChange={setRecipientName} placeholder="Recipient name" />
        <FormField label="Who is it from?" value={senderName} onChange={setSenderName} placeholder="Your name" />
        <FormField label="A message to carry through" value={message} onChange={setMessage} placeholder="Write something only you would say" multiline />
        <fieldset><legend>What is the moment?</legend><div className="choice-grid">{occasions.map((option) => <ChoiceButton key={option.id} selected={occasion === option.id} label={option.label} onClick={() => setOccasion(option.id)} />)}</div></fieldset>
        <fieldset><legend>Choose a mood</legend><div className="choice-grid">{themes.map((option) => <ChoiceButton key={option.id} selected={themeId === option.id} label={option.label} color={option.color} onClick={() => setThemeId(option.id)} />)}</div></fieldset>
        <div className="form-footer"><p>{saved ? 'Draft saved locally — ready for a recipient preview.' : 'Required: recipient and sender names.'}</p><PrimaryButton label={saved ? 'Update local draft' : 'Save local draft'} disabled={!canPreview} /></div>
      </form>
      {saved && <section className="success-panel"><h2>Your development preview is ready.</h2><p>This is not published and cannot be shared yet. It is a safe local preview of the future creator-to-recipient handoff.</p><SecondaryButton label="Preview recipient view" onClick={() => navigate({ name: 'recipient', giftId: 'local-preview' })} /></section>}
    </Page>
  );
}

function RecipientRoute({ draft, navigate }: { draft: GiftDraft | null; navigate: (route: WebRoute) => void }) {
  const name = draft?.recipientName || 'someone special';
  const sender = draft?.senderName || 'a thoughtful friend';
  return <Page eyebrow="RECIPIENT EXPERIENCE" title={`A little world, made for ${name}.`} description="This recipient boundary is ready for secure delivery. The current screen is a development preview, not a published gift."><section className="recipient-card"><span className="recipient-mark" aria-hidden="true">✦</span><h2>A gift from {sender}</h2><p className="recipient-message">{draft?.message || 'Something lovely is waiting for you.'}</p><div className="locked-experience"><p className="locked-label">INTERACTIVE EXPERIENCE SLOT</p><h3>The first playable module lands in the next vertical slice.</h3><p>The host will own gift identity, persistence, permissions, and completion events. This slot is deliberately honest while those boundaries are being built.</p></div><SecondaryButton label="Back to discovery" onClick={() => navigate({ name: 'home' })} /></section><Notice>Development preview · not published · no secure recipient token issued.</Notice></Page>;
}

function AdminRoute({ navigate }: { navigate: (route: WebRoute) => void }) {
  return <Page eyebrow="ADMINISTRATION" title="A calm control room is on the way." description="The route boundary exists so future operational tools have a home, without pretending they are ready today."><section className="admin-card"><span className="admin-icon" aria-hidden="true">◌</span><h2>Not available in Phase 1A</h2><p>Catalog operations, moderation, analytics, and entitlements will arrive behind server-side permissions.</p><SecondaryButton label="Return home" onClick={() => navigate({ name: 'home' })} /></section></Page>;
}

function FeatureCard({ index, title, body }: { index: string; title: string; body: string }) { return <article className="feature-card"><p className="feature-index">{index}</p><h3>{title}</h3><p>{body}</p></article>; }
function FormField({ label, value, onChange, placeholder, multiline = false }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; multiline?: boolean }) { return <label className="form-field"><span>{label}</span>{multiline ? <textarea aria-label={label} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /> : <input aria-label={label} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />}{multiline && <small>Keep it personal. This is the line they will remember.</small>}</label>; }
function ChoiceButton({ selected, label, color, onClick }: { selected: boolean; label: string; color?: string; onClick: () => void }) { return <button className={`choice${selected ? ' is-selected' : ''}`} type="button" aria-pressed={selected} onClick={onClick} style={selected && color ? { borderColor: color } : undefined}><span className="choice-dot" style={{ backgroundColor: color ?? '#6366f1' }} aria-hidden="true" />{label}</button>; }
function PrimaryButton({ label, onClick, disabled = false }: { label: string; onClick?: () => void; disabled?: boolean }) { return <button className="primary-button" type={onClick ? 'button' : 'submit'} onClick={onClick} disabled={disabled}>{label}<span aria-hidden="true">↗</span></button>; }
function SecondaryButton({ label, onClick }: { label: string; onClick: () => void }) { return <button className="secondary-button" type="button" onClick={onClick}>{label}</button>; }
function Notice({ children }: { children: ReactNode }) { return <aside className="notice"><span aria-hidden="true">i</span><p>{children}</p></aside>; }
