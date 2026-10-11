import { artStyleService } from '../services/ArtStyleService';

describe('ArtStyleService', () => {
  describe('getAllStyles', () => {
    it('should return all configured art styles', () => {
      const styles = artStyleService.getAllStyles();
      expect(styles).toHaveLength(7);
    });

    it('should have required properties', () => {
      const styles = artStyleService.getAllStyles();
      styles.forEach(style => {
        expect(style).toHaveProperty('id');
        expect(style).toHaveProperty('name');
        expect(style).toHaveProperty('description');
        expect(style).toHaveProperty('colors');
      });
    });
  });

  describe('getStyleById', () => {
    it('should return pixel style', () => {
      const style = artStyleService.getStyleById('pixel');
      expect(style).toBeDefined();
      expect(style?.name).toBe('Pixel Perfect');
    });

    it('should return lowpoly style', () => {
      const style = artStyleService.getStyleById('lowpoly');
      expect(style).toBeDefined();
      expect(style?.name).toBe('Low Poly 3D');
    });

    it('should return undefined for invalid ID', () => {
      const style = artStyleService.getStyleById('invalid' as any);
      expect(style).toBeUndefined();
    });
  });

  describe('getStyleColors', () => {
    it('should return color palette for valid style', () => {
      const colors = artStyleService.getStyleColors('pixel');
      expect(colors).toBeDefined();
      expect(colors).toHaveProperty('primary');
      expect(colors).toHaveProperty('secondary');
      expect(colors).toHaveProperty('accent');
      expect(colors).toHaveProperty('background');
      expect(colors).toHaveProperty('text');
    });
  });

  describe('generateUIPalette', () => {
    it('should generate complete UI palette', () => {
      const palette = artStyleService.generateUIPalette('cyberpunk');
      expect(palette).toHaveProperty('background');
      expect(palette).toHaveProperty('surface');
      expect(palette).toHaveProperty('primary');
      expect(palette).toHaveProperty('text');
      expect(palette).toHaveProperty('border');
    });
  });

  describe('getAssetRecommendations', () => {
    it('should return recommendations for pixel style', () => {
      const recommendations = artStyleService.getAssetRecommendations('pixel');
      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBeGreaterThan(0);
    });

    it('should return recommendations for all styles', () => {
      const styles: Array<'pixel' | 'lowpoly' | 'handdrawn' | 'cyberpunk' | 'watercolor'> = [
        'pixel',
        'lowpoly',
        'handdrawn',
        'cyberpunk',
        'watercolor',
      ];

      styles.forEach(styleId => {
        const recommendations = artStyleService.getAssetRecommendations(styleId);
        expect(recommendations.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Color Palettes', () => {
    it('should have valid hex colors', () => {
      const styles = artStyleService.getAllStyles();
      const hexPattern = /^#[0-9A-Fa-f]{6}$/;

      styles.forEach(style => {
        expect(style.colors.primary).toMatch(hexPattern);
        expect(style.colors.secondary).toMatch(hexPattern);
        expect(style.colors.accent).toMatch(hexPattern);
        expect(style.colors.background).toMatch(hexPattern);
        expect(style.colors.text).toMatch(hexPattern);
      });
    });

    it('should have custom color arrays', () => {
      const styles = artStyleService.getAllStyles();
      styles.forEach(style => {
        expect(Array.isArray(style.colors.custom)).toBe(true);
        expect(style.colors.custom.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Style Characteristics', () => {
    it('pixel style should have filters', () => {
      const style = artStyleService.getStyleById('pixel');
      expect(style?.filters).toBeDefined();
      expect(Array.isArray(style?.filters)).toBe(true);
    });

    it('lowpoly style should have shaders', () => {
      const style = artStyleService.getStyleById('lowpoly');
      expect(style?.shaders).toBeDefined();
      expect(Array.isArray(style?.shaders)).toBe(true);
    });

    it('cyberpunk style should have both filters and shaders', () => {
      const style = artStyleService.getStyleById('cyberpunk');
      expect(style?.shaders).toBeDefined();
      expect(style?.filters).toBeDefined();
    });
  });
});
