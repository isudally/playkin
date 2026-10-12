> **LEGACY API REFERENCE — This documents older GameForge services and must not be treated as the current browser gift service API or as proof of working AI/engines.** See [Product Vision](../PRODUCT_INTENT.md), [Creative Direction](CREATIVE_DIRECTION.md) and [Documentation Guide](DOCUMENTATION_INDEX.md).

# API Reference

Complete API documentation for GameForge Mobile.

## Core APIs

### Engine Factory

Create game engine instances.

```typescript
import { EngineFactory } from '@/engines/IGameEngine';

// Create engine
const engine = await EngineFactory.createEngine('pixi' | 'babylon' | 'aframe');
```

### Game Engine Interface

All engines implement `IGameEngine`.

#### Methods

**initialize(container: HTMLElement): Promise<void>**
Initialize the game engine.

**loadScene(scene: Scene): Promise<void>**
Load a game scene.

**createGameObject(object: GameObject): void**
Add an object to the scene.

**updateGameObject(id: string, updates: Partial<GameObject>): void**
Update object properties.

**removeGameObject(id: string): void**
Remove object from scene.

## Services

### Template Library

Access game templates.

```typescript
import { templateLibrary } from '@/services/TemplateLibrary';

// Get all templates
const templates = templateLibrary.getAllTemplates();

// Get by ID
const template = templateLibrary.getTemplateById('match3');

// Filter by category
const puzzles = templateLibrary.getTemplatesByCategory('puzzle');
```

### Genie Service

AI assistant integration.

```typescript
import { genieService } from '@/services/GenieService';

// Process message
const response = await genieService.processMessage(
  'How do I add physics?',
  'technical',
  context
);

// Generate code
const code = await genieService.generateCode(
  'Create a score system',
  'typescript'
);
```

### Art Style Service

Apply visual styles.

```typescript
import { artStyleService } from '@/services/ArtStyleService';

// Get all styles
const styles = artStyleService.getAllStyles();

// Apply style
artStyleService.applyStyleToEngine('pixel', engine);

// Get colors
const palette = artStyleService.getStyleColors('cyberpunk');
```

### Marketing Service

Marketing and analytics tools.

```typescript
import { marketingService } from '@/services/MarketingService';

// Create campaign
const campaign = marketingService.createCampaign(projectId, 'social');

// Generate content
const content = await marketingService.generatePromotionalContent(
  'My Game',
  'puzzle',
  ['match-3', 'power-ups']
);

// Get analytics
const analytics = marketingService.getAnalyticsDashboard(projectId);
```

## React Hooks

### useGenie

Access Genie AI assistant.

```typescript
import { useGenie } from '@/contexts/GenieContext';

function Component() {
  const {
    personality,
    setPersonality,
    messages,
    sendMessage,
    clearMessages,
    isProcessing
  } = useGenie();
  
  // Use Genie
  await sendMessage('Help me!');
}
```

### useTheme

Access theme configuration.

```typescript
import { useTheme } from '@/contexts/ThemeContext';

function Component() {
  const { theme, toggleTheme, isDark } = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      {/* content */}
    </View>
  );
}
```

## Types

### Project

```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  type: 'game' | 'vr' | 'educational';
  engine: 'pixi' | 'babylon' | 'aframe';
  template?: string;
  artStyle?: ArtStyle;
  createdAt: Date;
  updatedAt: Date;
  thumbnail?: string;
  data: ProjectData;
}
```

### GameObject

```typescript
interface GameObject {
  id: string;
  name: string;
  type: string;
  position: { x: number; y: number; z?: number };
  rotation?: { x: number; y: number; z: number };
  scale?: { x: number; y: number; z?: number };
  properties: Record<string, any>;
  components: Component[];
}
```

### GenieMessage

```typescript
interface GenieMessage {
  id: string;
  personality: GeniePersonality;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  codeSnippet?: string;
}
```

---

For complete type definitions, see `src/types/index.ts`.
