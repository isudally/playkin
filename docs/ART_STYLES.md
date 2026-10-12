> **HISTORICAL ART-STYLE IDEAS — The five listed styles are older design concepts, not five finished production-ready Playkin game worlds.** See [Product Vision](../PRODUCT_INTENT.md), [Creative Direction](CREATIVE_DIRECTION.md) and [Documentation Guide](DOCUMENTATION_INDEX.md).

# Art Styles Guide

GameForge includes 5 signature art styles, each with complete color palettes, shaders, and filters.

## The 5 Art Styles

### 1. Pixel Perfect 🕹️

**Style:** Retro 8-bit/16-bit aesthetic

**Best For:** Nostalgic games, casual puzzles, retro platformers

**Colors:**
- Primary: #ff6b6b (Red)
- Secondary: #4ecdc4 (Teal)
- Accent: #ffe66d (Yellow)
- Background: #1a1a2e (Dark Blue)

**Effects:**
- Pixelation filter
- Limited color palette
- Crisp edges
- Retro UI elements

**Use Cases:**
- Retro arcade games
- Pixel art platformers
- Classic puzzle games

### 2. Low Poly 3D 🔷

**Style:** Minimalist 3D with flat shading

**Best For:** Modern 3D games, stylized environments

**Colors:**
- Primary: #ff9a76 (Coral)
- Secondary: #96ceb4 (Mint)
- Accent: #ffeaa7 (Light Yellow)
- Background: #dfe6e9 (Light Gray)

**Effects:**
- Flat shading
- Geometric shapes
- Clean lines
- Minimalist design

**Use Cases:**
- 3D puzzle games
- Racing games
- Strategy games

### 3. Hand-Drawn ✏️

**Style:** Sketch and cartoon aesthetic

**Best For:** Story-driven games, casual adventures

**Colors:**
- Primary: #ff6b9d (Pink)
- Secondary: #c44569 (Dark Pink)
- Accent: #f8b500 (Orange)
- Background: #fff5e4 (Cream)

**Effects:**
- Outline shader
- Sketch filter
- Paper texture
- Hand-crafted feel

**Use Cases:**
- Interactive stories
- Adventure games
- Educational content

### 4. Neon Cyberpunk 🌃

**Style:** Futuristic with glowing neon

**Best For:** Sci-fi games, action shooters

**Colors:**
- Primary: #ff00ff (Magenta)
- Secondary: #00ffff (Cyan)
- Accent: #ffff00 (Yellow)
- Background: #0a0e27 (Dark Navy)

**Effects:**
- Neon glow shader
- Bloom filter
- Scanlines
- Holographic UI

**Use Cases:**
- Sci-fi shooters
- Futuristic racers
- Cyberpunk adventures

### 5. Watercolor Dreams 🎨

**Style:** Soft artistic with pastel colors

**Best For:** Relaxing games, art-focused experiences

**Colors:**
- Primary: #f5c7f7 (Light Purple)
- Secondary: #c3aed6 (Lavender)
- Accent: #ffd2a0 (Peach)
- Background: #fef9f3 (Off-White)

**Effects:**
- Watercolor texture
- Soft blur
- Paper overlay
- Gentle gradients

**Use Cases:**
- Puzzle games
- Meditation apps
- Art games

## Applying Art Styles

```typescript
import { artStyleService } from '@/services/ArtStyleService';

// Get style
const style = artStyleService.getStyleById('pixel');

// Apply to engine
artStyleService.applyStyleToEngine('pixel', engine);

// Get color palette
const colors = artStyleService.getStyleColors('cyberpunk');

// Generate UI palette
const uiPalette = artStyleService.generateUIPalette('watercolor');
```

## Customizing Styles

Each style can be customized:

```typescript
const customStyle = {
  ...pixelStyle,
  colors: {
    ...pixelStyle.colors,
    primary: '#your-color'
  }
};
```

## Asset Recommendations

Each style has recommended asset types:

```typescript
const recommendations = artStyleService.getAssetRecommendations('pixel');
// Returns: ['8x8 sprites', 'chip-tune music', etc.]
```

## Best Practices

1. **Stay Consistent** - Use one style throughout
2. **Consider Genre** - Match style to game type
3. **Test on Devices** - Ensure readability
4. **Optimize Assets** - Follow style guidelines

---

For implementation details, see `src/services/ArtStyleService.ts`.
