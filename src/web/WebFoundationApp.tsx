import React, { useCallback, useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { GiftDraft, GiftOccasion, GiftTheme } from './domain/playkin-domain';
import { resolveWebRoute, routeToPath, WebRoute } from './routes';
import { temporaryAssetNote, webTheme } from './theme';

const DRAFT_KEY = 'playkin.phase1a.draft';

const occasionOptions: readonly { id: GiftOccasion; label: string }[] = [
  { id: 'birthday', label: 'Birthday' },
  { id: 'anniversary', label: 'Anniversary' },
  { id: 'thank-you', label: 'Thank you' },
  { id: 'just-because', label: 'Just because' },
];

const themeOptions: readonly { id: GiftTheme; label: string; color: string }[] = [
  { id: 'golden-reunion', label: 'Golden reunion', color: '#FBBF24' },
  { id: 'eternal-romance', label: 'Eternal romance', color: '#EC4899' },
  { id: 'creator-wave', label: 'Creator wave', color: '#6366F1' },
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
    const path = routeToPath(nextRoute);
    window.history.pushState({}, '', path);
    setRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return { route, navigate };
}

export default function WebFoundationApp() {
  const { route, navigate } = useWebNavigation();
  const [draft, setDraft] = useState<GiftDraft | null>(() => {
    try {
      const saved = window.localStorage.getItem(DRAFT_KEY);
      return saved ? (JSON.parse(saved) as GiftDraft) : null;
    } catch {
      return null;
    }
  });

  const saveDraft = useCallback((nextDraft: GiftDraft) => {
    setDraft(nextDraft);
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(nextDraft));
  }, []);

  return (
    <View style={styles.app}>
      <NavigationBar route={route} navigate={navigate} />
      {route.name === 'home' && <HomeRoute draft={draft} navigate={navigate} />}
      {route.name === 'create' && <CreateRoute saveDraft={saveDraft} navigate={navigate} />}
      {route.name === 'recipient' && <RecipientRoute draft={draft} navigate={navigate} />}
      {route.name === 'admin' && <AdminRoute navigate={navigate} />}
    </View>
  );
}

function NavigationBar({ route, navigate }: { route: WebRoute; navigate: (route: WebRoute) => void }) {
  return (
    <View style={styles.navWrap}>
      <View style={styles.nav}>
        <Pressable accessibilityRole="link" accessibilityLabel="Playkin home" onPress={() => navigate({ name: 'home' })}>
          <Text style={styles.brand}>playkin<Text style={styles.brandDot}>.</Text></Text>
        </Pressable>
        <View style={styles.navLinks}>
          <NavLink active={route.name === 'home'} label="Discover" onPress={() => navigate({ name: 'home' })} />
          <NavLink active={route.name === 'create'} label="Create a gift" onPress={() => navigate({ name: 'create' })} />
          <NavLink active={route.name === 'admin'} label="Admin" onPress={() => navigate({ name: 'admin' })} />
        </View>
        <View style={styles.navBadge}><Text style={styles.navBadgeText}>Web foundation</Text></View>
      </View>
    </View>
  );
}

function NavLink({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  return <Pressable accessibilityRole="link" onPress={onPress} style={[styles.navLink, active && styles.navLinkActive]}><Text style={styles.navLinkText}>{label}</Text></Pressable>;
}

function Page({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: React.ReactNode }) {
  return <ScrollView contentContainerStyle={styles.page}><View style={styles.pageIntro}><Text style={styles.eyebrow}>{eyebrow}</Text><Text accessibilityRole="header" style={styles.title}>{title}</Text><Text style={styles.description}>{description}</Text></View>{children}</ScrollView>;
}

function HomeRoute({ draft, navigate }: { draft: GiftDraft | null; navigate: (route: WebRoute) => void }) {
  return <Page eyebrow="THE PLAYKIN WEB FOUNDATION" title="Make a little magic for someone you love." description="A premium home for thoughtful, playable gifts — starting with a creator flow that keeps the human feeling at the centre.">
    <View style={styles.heroGrid}>
      <View style={styles.heroCard}><Text style={styles.heroKicker}>A new kind of gift</Text><Text style={styles.heroHeadline}>Small moments deserve a world of their own.</Text><Text style={styles.heroBody}>Shape a personal idea, choose a mood, and preview the recipient experience. Publishing and payment are intentionally not available in this foundation release.</Text><View style={styles.actionRow}><PrimaryButton label="Create a gift" onPress={() => navigate({ name: 'create' })} /><SecondaryButton label="See recipient view" onPress={() => navigate({ name: 'recipient', giftId: draft?.id ?? 'preview' })} /></View></View>
      <View style={styles.dodoCard}><Text style={styles.dodo}>🦤</Text><Text style={styles.dodoTitle}>Dodo is keeping watch</Text><Text style={styles.dodoBody}>A temporary development character while the final brand artwork is being prepared.</Text></View>
    </View>
    <View style={styles.section}><Text style={styles.sectionTitle}>Designed for the journey</Text><View style={styles.featureGrid}><FeatureCard index="01" title="Create with feeling" body="A guided questionnaire turns a relationship, occasion, and message into a clear gift draft." /><FeatureCard index="02" title="Hand over with delight" body="The recipient view is a separate route, ready for secure delivery and interactive modules." /><FeatureCard index="03" title="Grow without rewrites" body="Host-controlled contracts keep persistence, AI, entitlements, and analytics outside the experience module." /></View></View>
    <Notice>{temporaryAssetNote}</Notice>
  </Page>;
}

function CreateRoute({ saveDraft, navigate }: { saveDraft: (draft: GiftDraft) => void; navigate: (route: WebRoute) => void }) {
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [occasion, setOccasion] = useState<GiftOccasion>('birthday');
  const [themeId, setThemeId] = useState<GiftTheme>('golden-reunion');
  const [saved, setSaved] = useState(false);
  const canPreview = recipientName.trim().length > 0 && senderName.trim().length > 0;

  const onSave = () => {
    if (!canPreview) return;
    saveDraft(createDraft({ recipientName: recipientName.trim(), senderName: senderName.trim(), occasion, message: message.trim(), themeId }));
    setSaved(true);
  };

  return <Page eyebrow="CREATE A GIFT" title="Start with the person, not a template." description="This local development draft stays in your browser. Server persistence, secure links, and publishing arrive in Phase 1B.">
    <View style={styles.formCard}><FormField label="Who is this for?" value={recipientName} onChangeText={setRecipientName} placeholder="Recipient name" /><FormField label="Who is it from?" value={senderName} onChangeText={setSenderName} placeholder="Your name" /><FormField label="A message to carry through" value={message} onChangeText={setMessage} placeholder="Write something only you would say" multiline />
      <Text style={styles.fieldLabel}>What is the moment?</Text><View style={styles.choiceGrid}>{occasionOptions.map((option) => <ChoiceButton key={option.id} selected={occasion === option.id} label={option.label} onPress={() => setOccasion(option.id)} />)}</View>
      <Text style={styles.fieldLabel}>Choose a mood</Text><View style={styles.choiceGrid}>{themeOptions.map((option) => <ChoiceButton key={option.id} selected={themeId === option.id} label={option.label} color={option.color} onPress={() => setThemeId(option.id)} />)}</View>
      <View style={styles.formFooter}><Text style={styles.formHint}>{saved ? 'Draft saved locally — ready for a recipient preview.' : 'Required: recipient and sender names.'}</Text><PrimaryButton label={saved ? 'Update local draft' : 'Save local draft'} onPress={onSave} disabled={!canPreview} /></View>
    </View>
    {saved && <View style={styles.successPanel}><Text style={styles.successTitle}>Your development preview is ready.</Text><Text style={styles.successBody}>This is not published and cannot be shared yet. It is a safe local preview of the future creator-to-recipient handoff.</Text><SecondaryButton label="Preview recipient view" onPress={() => navigate({ name: 'recipient', giftId: 'local-preview' })} /></View>}
  </Page>;
}

function RecipientRoute({ draft, navigate }: { draft: GiftDraft | null; navigate: (route: WebRoute) => void }) {
  const name = draft?.recipientName || 'someone special';
  const sender = draft?.senderName || 'a thoughtful friend';
  return <Page eyebrow="RECIPIENT EXPERIENCE" title={`A little world, made for ${name}.`} description="This recipient boundary is ready for secure delivery. The current screen is a development preview, not a published gift.">
    <View style={styles.recipientCard}><Text style={styles.recipientMark}>✦</Text><Text style={styles.recipientTitle}>A gift from {sender}</Text><Text style={styles.recipientMessage}>{draft?.message || 'Something lovely is waiting for you.'}</Text><View style={styles.lockedExperience}><Text style={styles.lockedLabel}>INTERACTIVE EXPERIENCE SLOT</Text><Text style={styles.lockedTitle}>The first playable module lands in the next vertical slice.</Text><Text style={styles.lockedBody}>The host will own gift identity, persistence, permissions, and completion events. This slot is deliberately honest while those boundaries are being built.</Text></View><SecondaryButton label="Back to discovery" onPress={() => navigate({ name: 'home' })} /></View>
    <Notice>Development preview · not published · no secure recipient token issued.</Notice>
  </Page>;
}

function AdminRoute({ navigate }: { navigate: (route: WebRoute) => void }) {
  return <Page eyebrow="ADMINISTRATION" title="A calm control room is on the way." description="The route boundary exists so future operational tools have a home, without pretending they are ready today."><View style={styles.adminCard}><Text style={styles.adminIcon}>◌</Text><Text style={styles.sectionTitle}>Not available in Phase 1A</Text><Text style={styles.description}>Catalog operations, moderation, analytics, and entitlements will arrive behind server-side permissions.</Text><SecondaryButton label="Return home" onPress={() => navigate({ name: 'home' })} /></View></Page>;
}

function FeatureCard({ index, title, body }: { index: string; title: string; body: string }) { return <View style={styles.featureCard}><Text style={styles.featureIndex}>{index}</Text><Text style={styles.featureTitle}>{title}</Text><Text style={styles.featureBody}>{body}</Text></View>; }

function FormField({ label, value, onChangeText, placeholder, multiline = false }: { label: string; value: string; onChangeText: (value: string) => void; placeholder: string; multiline?: boolean }) { return <View style={styles.field}><Text style={styles.fieldLabel}>{label}</Text><TextInput accessibilityLabel={label} value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={webTheme.colors.muted} multiline={multiline} style={[styles.input, multiline && styles.multilineInput]} />{multiline && <Text style={styles.fieldHint}>Keep it personal. This is the line they will remember.</Text>}</View>; }

function ChoiceButton({ selected, label, color, onPress }: { selected: boolean; label: string; color?: string; onPress: () => void }) { return <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress} style={[styles.choice, selected && styles.choiceSelected, selected && color ? { borderColor: color } : null]}><View style={[styles.choiceDot, { backgroundColor: color ?? webTheme.colors.primary }]} /><Text style={styles.choiceText}>{label}</Text></Pressable>; }

function PrimaryButton({ label, onPress, disabled = false }: { label: string; onPress: () => void; disabled?: boolean }) { return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={[styles.primaryButton, disabled && styles.buttonDisabled]}><Text style={styles.primaryButtonText}>{label}</Text><Text style={styles.buttonArrow}>↗</Text></Pressable>; }
function SecondaryButton({ label, onPress }: { label: string; onPress: () => void }) { return <Pressable accessibilityRole="button" onPress={onPress} style={styles.secondaryButton}><Text style={styles.secondaryButtonText}>{label}</Text></Pressable>; }
function Notice({ children }: { children: React.ReactNode }) { return <View style={styles.notice}><Text style={styles.noticeMark}>i</Text><Text style={styles.noticeText}>{children}</Text></View>; }

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: webTheme.colors.background },
  navWrap: { borderBottomWidth: 1, borderBottomColor: webTheme.colors.border, backgroundColor: 'rgba(12, 10, 9, 0.9)' },
  nav: { width: '100%', maxWidth: 1180, alignSelf: 'center', minHeight: 76, paddingHorizontal: webTheme.spacing.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: webTheme.spacing.md },
  brand: { color: webTheme.colors.text, fontSize: 23, fontWeight: '800', letterSpacing: -1 },
  brandDot: { color: webTheme.colors.accent },
  navLinks: { flexDirection: 'row', alignItems: 'center', gap: webTheme.spacing.sm },
  navLink: { paddingHorizontal: webTheme.spacing.sm, paddingVertical: 10, borderRadius: webTheme.radii.pill },
  navLinkActive: { backgroundColor: 'rgba(99, 102, 241, 0.18)' },
  navLinkText: { color: webTheme.colors.text, fontSize: 14, fontWeight: '600' },
  navBadge: { borderWidth: 1, borderColor: webTheme.colors.border, borderRadius: webTheme.radii.pill, paddingHorizontal: 10, paddingVertical: 6 },
  navBadgeText: { color: webTheme.colors.muted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  page: { width: '100%', maxWidth: 1180, alignSelf: 'center', padding: webTheme.spacing.xl, gap: webTheme.spacing.xl },
  pageIntro: { maxWidth: 760, gap: webTheme.spacing.sm, paddingTop: webTheme.spacing.xl },
  eyebrow: { color: webTheme.colors.accent, fontSize: 12, fontWeight: '800', letterSpacing: 1.6 },
  title: { color: webTheme.colors.text, fontSize: webTheme.type.display, lineHeight: 56, fontWeight: '800', letterSpacing: -2 },
  description: { color: webTheme.colors.muted, fontSize: 17, lineHeight: 27 },
  heroGrid: { flexDirection: 'row', gap: webTheme.spacing.lg, flexWrap: 'wrap' },
  heroCard: { flex: 1, minWidth: 300, backgroundColor: webTheme.colors.surface, borderRadius: webTheme.radii.lg, padding: webTheme.spacing.xl, gap: webTheme.spacing.md, borderWidth: 1, borderColor: webTheme.colors.border },
  heroKicker: { color: webTheme.colors.secondary, fontSize: 13, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  heroHeadline: { color: webTheme.colors.text, fontSize: 32, lineHeight: 39, fontWeight: '800', letterSpacing: -1 },
  heroBody: { color: webTheme.colors.muted, fontSize: 16, lineHeight: 25, maxWidth: 640 },
  actionRow: { flexDirection: 'row', gap: webTheme.spacing.sm, flexWrap: 'wrap', paddingTop: webTheme.spacing.sm },
  dodoCard: { flexBasis: 260, flexGrow: 0, backgroundColor: '#201A32', borderRadius: webTheme.radii.lg, padding: webTheme.spacing.xl, justifyContent: 'center', alignItems: 'center', gap: webTheme.spacing.sm, borderWidth: 1, borderColor: 'rgba(236, 72, 153, 0.28)' },
  dodo: { fontSize: 78 },
  dodoTitle: { color: webTheme.colors.text, fontSize: 18, fontWeight: '800', textAlign: 'center' },
  dodoBody: { color: webTheme.colors.muted, fontSize: 13, lineHeight: 20, textAlign: 'center' },
  section: { gap: webTheme.spacing.md },
  sectionTitle: { color: webTheme.colors.text, fontSize: 22, fontWeight: '800' },
  featureGrid: { flexDirection: 'row', gap: webTheme.spacing.md, flexWrap: 'wrap' },
  featureCard: { flex: 1, minWidth: 220, backgroundColor: webTheme.colors.surface, borderRadius: webTheme.radii.md, padding: webTheme.spacing.lg, gap: webTheme.spacing.sm, borderWidth: 1, borderColor: webTheme.colors.border },
  featureIndex: { color: webTheme.colors.accent, fontSize: 12, fontWeight: '800' },
  featureTitle: { color: webTheme.colors.text, fontSize: 18, fontWeight: '800' },
  featureBody: { color: webTheme.colors.muted, fontSize: 14, lineHeight: 22 },
  primaryButton: { minHeight: 48, borderRadius: webTheme.radii.pill, paddingHorizontal: 20, backgroundColor: webTheme.colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  primaryButtonText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  buttonArrow: { color: '#fff', fontSize: 18 },
  buttonDisabled: { opacity: 0.42 },
  secondaryButton: { minHeight: 48, borderRadius: webTheme.radii.pill, paddingHorizontal: 18, borderWidth: 1, borderColor: webTheme.colors.border, alignItems: 'center', justifyContent: 'center' },
  secondaryButtonText: { color: webTheme.colors.text, fontSize: 15, fontWeight: '700' },
  notice: { flexDirection: 'row', gap: 10, padding: webTheme.spacing.md, borderRadius: webTheme.radii.md, backgroundColor: 'rgba(245, 158, 11, 0.1)', borderWidth: 1, borderColor: 'rgba(245, 158, 11, 0.26)' },
  noticeMark: { color: webTheme.colors.accent, fontWeight: '900' },
  noticeText: { flex: 1, color: webTheme.colors.muted, fontSize: 13, lineHeight: 20 },
  formCard: { backgroundColor: webTheme.colors.surface, borderRadius: webTheme.radii.lg, padding: webTheme.spacing.xl, gap: webTheme.spacing.lg, borderWidth: 1, borderColor: webTheme.colors.border },
  field: { gap: 8 },
  fieldLabel: { color: webTheme.colors.text, fontSize: 14, fontWeight: '800' },
  input: { minHeight: 50, borderWidth: 1, borderColor: webTheme.colors.border, borderRadius: webTheme.radii.sm, paddingHorizontal: 15, color: webTheme.colors.text, fontSize: 16, backgroundColor: 'rgba(12, 10, 9, 0.42)' },
  multilineInput: { minHeight: 110, paddingTop: 14, textAlignVertical: 'top' },
  fieldHint: { color: webTheme.colors.muted, fontSize: 12 },
  choiceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: webTheme.spacing.sm },
  choice: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, borderRadius: webTheme.radii.pill, borderWidth: 1, borderColor: webTheme.colors.border },
  choiceSelected: { backgroundColor: 'rgba(99, 102, 241, 0.16)', borderColor: webTheme.colors.primary },
  choiceDot: { width: 8, height: 8, borderRadius: 8 },
  choiceText: { color: webTheme.colors.text, fontSize: 14, fontWeight: '700' },
  formFooter: { paddingTop: webTheme.spacing.sm, flexDirection: 'row', gap: webTheme.spacing.md, justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' },
  formHint: { color: webTheme.colors.muted, fontSize: 13, flex: 1, minWidth: 220 },
  successPanel: { padding: webTheme.spacing.lg, gap: webTheme.spacing.sm, borderRadius: webTheme.radii.md, backgroundColor: 'rgba(52, 211, 153, 0.1)', borderWidth: 1, borderColor: 'rgba(52, 211, 153, 0.26)' },
  successTitle: { color: webTheme.colors.success, fontSize: 18, fontWeight: '800' },
  successBody: { color: webTheme.colors.muted, fontSize: 14, lineHeight: 22 },
  recipientCard: { backgroundColor: webTheme.colors.surface, borderRadius: webTheme.radii.lg, padding: webTheme.spacing.xxl, gap: webTheme.spacing.md, alignItems: 'center', borderWidth: 1, borderColor: webTheme.colors.border },
  recipientMark: { color: webTheme.colors.accent, fontSize: 44 },
  recipientTitle: { color: webTheme.colors.text, fontSize: 24, fontWeight: '800', textAlign: 'center' },
  recipientMessage: { color: webTheme.colors.secondary, fontSize: 19, lineHeight: 29, textAlign: 'center', maxWidth: 620 },
  lockedExperience: { width: '100%', maxWidth: 680, padding: webTheme.spacing.lg, gap: webTheme.spacing.sm, borderRadius: webTheme.radii.md, backgroundColor: 'rgba(99, 102, 241, 0.12)', borderWidth: 1, borderColor: 'rgba(99, 102, 241, 0.28)' },
  lockedLabel: { color: webTheme.colors.primary, fontSize: 11, fontWeight: '900', letterSpacing: 1.2 },
  lockedTitle: { color: webTheme.colors.text, fontSize: 18, fontWeight: '800' },
  lockedBody: { color: webTheme.colors.muted, fontSize: 14, lineHeight: 22 },
  adminCard: { backgroundColor: webTheme.colors.surface, borderRadius: webTheme.radii.lg, padding: webTheme.spacing.xxl, gap: webTheme.spacing.md, alignItems: 'flex-start', borderWidth: 1, borderColor: webTheme.colors.border },
  adminIcon: { color: webTheme.colors.secondary, fontSize: 64 },
});
