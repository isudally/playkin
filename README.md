# GameForge Mobile 🎮✨

> AI-powered game creation platform - Create professional mobile games, VR experiences, and educational content with **zero coding required**.

> **Delivery status:** This repository is in a controlled web-first migration. The authoritative verified status is in [`docs/STATUS.md`](docs/STATUS.md); the feature list below includes historical product intent and is not a release-readiness claim.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React Native](https://img.shields.io/badge/React%20Native-0.72-61DAFB.svg)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.1-blue.svg)](https://www.typescriptlang.org/)
[![Deploy Web](https://github.com/ismaelloveexcel/gameforge-mobile/actions/workflows/deploy-web.yml/badge.svg)](https://github.com/ismaelloveexcel/gameforge-mobile/actions/workflows/deploy-web.yml)
[![Build Mobile](https://github.com/ismaelloveexcel/gameforge-mobile/actions/workflows/build-mobile.yml/badge.svg)](https://github.com/ismaelloveexcel/gameforge-mobile/actions/workflows/build-mobile.yml)
[![CI](https://github.com/ismaelloveexcel/gameforge-mobile/actions/workflows/ci.yml/badge.svg)](https://github.com/ismaelloveexcel/gameforge-mobile/actions/workflows/ci.yml)

## 🌟 Features

### 🎁 GiftForge – Personalized Gift Mini-Games

Create unique, personalized mini-games as gifts for loved ones!

**How it works:**
1. **Start**: Tap "Create a Gift Game" on the home screen
2. **Questionnaire**: Complete a guided multi-step wizard:
   - Choose the **occasion** (birthday, anniversary, Valentine's, etc.)
   - Describe the **recipient** (age, personality traits, interests)
   - Set the **relationship & tone** (heartfelt, playful, romantic, etc.)
   - Pick a **game type** (Runner, Story & Choices, Puzzle, Adventure, Educational)
   - Select a **visual style** (Colorful Cartoon, Elegant Minimal, Retro Pixel, etc.)
   - Add **personal touches** (recipient name, your name, heartfelt message)
3. **Generate**: AI creates a personalized game with custom dialogue, mechanics, and intro/end screens
4. **Share**: Get a unique playable web link to send to your recipient!

**Available Game Templates:**
- 🏃 **Runner Adventure** - Collect themed items in a side-scrolling adventure
- 📖 **Story & Choices** - Interactive narrative with meaningful decisions
- 🧩 **Puzzle & Challenges** - Brain teasers and fun challenges
- 🗺️ **Mini Adventure Quest** - Exploration with quests and surprises
- 🎓 **Educational & Playful** - Learn while having fun

**Features:**
- Progress bar and smooth Reanimated animations
- Live preview pane during creation
- AI-powered personalization via Grok API
- Safety filters to auto-reject inappropriate content
- Beautiful visual styles to match any taste
- Unique shareable web links for each gift

### Core Capabilities
- **🎨 15 Complete Game Templates** - Ready-to-use templates across all genres
- **🤖 Genie AI Assistant** - 4 specialized AI personalities to guide you
- **🎭 5 Signature Art Styles** - Professional visual themes for your games
- **🥽 VR/AR Support** - Create immersive experiences for Quest, PSVR, and WebXR
- **📊 Marketing Automation** - Built-in tools for promotion and analytics
- **🚀 Multi-Platform Export** - Deploy to iOS, Android, and Web

### Game Engines
- **Pixi.js** - High-performance 2D rendering
- **Babylon.js** - Advanced 3D graphics and physics
- **A-Frame** - VR/AR experiences with WebXR

### Genie AI Personalities
1. **Creative Mentor** 🎨 - Game design & storytelling guidance
2. **Technical Expert** ⚙️ - Implementation & optimization help
3. **Marketing Guru** 📈 - Promotion & monetization strategies
4. **Educator** 📚 - Teaching-focused content creation

### Game Templates

#### 2D Games (Pixi.js)
1. **Puzzle Match-3** - Classic gem-matching mechanics
2. **Endless Runner** - Side-scrolling action
3. **Tower Defense** - Strategic gameplay
4. **Platformer** - Jump and run adventure
5. **Quiz/Trivia** - Educational questions
6. **Card Game** - Deck building mechanics
7. **Idle Clicker** - Incremental progression
8. **Rhythm Game** - Music-based gameplay
9. **Interactive Story** - Choose-your-own-adventure

#### 3D Games (Babylon.js)
10. **Racing Game** - 3D tracks and vehicles
11. **Physics Puzzle** - Realistic physics challenges

#### VR/AR Games (A-Frame)
12. **VR Escape Room** - Immersive puzzle solving
13. **AR Treasure Hunt** - Location-based gameplay
14. **Virtual Museum** - Educational VR tours
15. **Shooting Gallery** - VR target practice

### Art Styles
1. **Pixel Perfect** 🕹️ - Retro pixel art
2. **Low Poly 3D** 🔷 - Minimalist 3D aesthetic
3. **Hand-Drawn** ✏️ - Sketch/cartoon style
4. **Neon Cyberpunk** 🌃 - Futuristic glowing effects
5. **Watercolor Dreams** 🎨 - Soft artistic rendering

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Studio

### Installation

```bash
# Clone the repository
git clone https://github.com/ismaelloveexcel/gameforge-mobile.git
cd gameforge-mobile

# Install dependencies
npm install

# Start the development server
npm start

# Run on iOS (Mac only)
npm run ios

# Run on Android
npm run android

# Run on Web
npm run web
```

## 📖 Documentation

### Getting Started
- [Getting Started Guide](docs/GETTING_STARTED.md)
- [Template Documentation](docs/TEMPLATES.md)
- [Genie AI Guide](docs/GENIE_AI.md)
- [Art Styles Guide](docs/ART_STYLES.md)
- [Marketing Automation](docs/MARKETING.md)
- [VR Development](docs/VR_GUIDE.md)
- [API Reference](docs/API.md)

### Deployment Guides 🚀
- [**GitHub Actions Automated Deployment**](docs/GITHUB_ACTIONS_DEPLOYMENT.md) - CI/CD with GitHub Actions ⭐ **NEW!**
- [**Deployment Summary**](docs/DEPLOYMENT_SUMMARY.md) - Quick overview
- [**Free Deployment Recommendation**](docs/FREE_DEPLOYMENT_RECOMMENDATION.md) - Complete guide
- [**Quick Deploy Guide**](docs/QUICK_DEPLOY_GUIDE.md) - Deploy in 10 minutes
- [**Platform Comparison**](docs/DEPLOYMENT_COMPARISON.md) - 8 platforms analyzed
- [Full Deployment Guide](docs/DEPLOYMENT.md) - All deployment options

## 🎯 Project Structure

```
gameforge-mobile/
├── src/
│   ├── components/       # Reusable UI components
│   ├── contexts/         # React contexts (Theme, Genie)
│   ├── engines/          # Game engine implementations
│   │   ├── PixiEngine.ts      # Pixi.js 2D engine
│   │   ├── BabylonEngine.ts   # Babylon.js 3D engine
│   │   └── AFrameEngine.ts    # A-Frame VR/AR engine
│   ├── navigation/       # App navigation setup
│   ├── screens/          # App screens
│   ├── services/         # Business logic services
│   │   ├── GenieService.ts        # AI assistant
│   │   ├── TemplateLibrary.ts     # Game templates
│   │   ├── ArtStyleService.ts     # Art styles
│   │   └── MarketingService.ts    # Marketing tools
│   ├── styles/           # Shared styles
│   ├── types/            # TypeScript types
│   └── utils/            # Utility functions
├── assets/               # Images, fonts, etc.
├── docs/                 # Documentation
├── App.tsx               # Root component
└── package.json          # Dependencies
```

## 🎮 Creating Your First Game

```typescript
import { templateLibrary } from './services/TemplateLibrary';
import { EngineFactory } from './engines/IGameEngine';

// 1. Select a template
const template = templateLibrary.getTemplateById('match3');

// 2. Create engine instance
const engine = await EngineFactory.createEngine('pixi');

// 3. Initialize engine
await engine.initialize(container);

// 4. Load template scene
await engine.loadScene(template.data.scenes[0]);

// 5. Start creating!
```

## 🤖 Using Genie AI

```typescript
import { useGenie } from './contexts/GenieContext';

function MyComponent() {
  const { personality, setPersonality, sendMessage } = useGenie();
  
  // Switch to Creative Mentor
  setPersonality('creative');
  
  // Ask for help
  await sendMessage('How do I create an engaging story?');
}
```

## 🎨 Applying Art Styles

```typescript
import { artStyleService } from './services/ArtStyleService';

// Get all available styles
const styles = artStyleService.getAllStyles();

// Apply a style to your game
artStyleService.applyStyleToEngine('pixel', engine);

// Get color palette
const colors = artStyleService.getStyleColors('cyberpunk');
```

## 📊 Marketing Tools

```typescript
import { marketingService } from './services/MarketingService';

// Create campaign
const campaign = marketingService.createCampaign(projectId, 'social');

// Generate promotional content
const content = await marketingService.generatePromotionalContent(
  'My Game',
  'puzzle',
  ['match-3', 'power-ups', 'leaderboards']
);

// Get analytics
const dashboard = marketingService.getAnalyticsDashboard(projectId);
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run linter
npm run lint
```

## 🏗️ Building for Production

```bash
# Build for web
npm run build:web

# Build for iOS
npm run build:ios

# Build for Android
npm run build:android
```

## 🚀 Deployment

### ⭐ NEW: Automated Deployment with GitHub Actions

GameForge Mobile now includes **automated CI/CD pipelines** using GitHub Actions - the free portal within GitHub!

**What you get:**
- ✅ **Automatic web deployment** to Vercel on every push to `main`
- ✅ **Automated mobile builds** with Expo EAS
- ✅ **Continuous integration** with linting and testing
- ✅ **Pull request previews** for testing before merge
- ✅ **100% FREE** for public repositories

**Quick Setup:**
1. Configure secrets in GitHub (VERCEL_TOKEN, EXPO_TOKEN)
2. Push to `main` branch
3. Watch automated deployments at `https://github.com/ismaelloveexcel/gameforge-mobile/actions`

📖 **[Complete GitHub Actions Setup Guide](docs/GITHUB_ACTIONS_DEPLOYMENT.md)**

---

### Manual Deployment: Expo EAS + Vercel

For manual deployments or local testing:

**Quick Deploy:**
```bash
# Web version (Free)
npm run build:web && vercel --prod

# Android APK (Free)
eas build --platform android --profile production
```

**Why this combination?**
- ✅ 100% Free tier available
- ✅ Native mobile app support (iOS & Android)
- ✅ Web deployment with global CDN
- ✅ Automatic CI/CD from GitHub
- ✅ Zero configuration needed

**See detailed guides:**
- 🤖 [GitHub Actions Deployment](docs/GITHUB_ACTIONS_DEPLOYMENT.md) - Automated CI/CD setup
- 📘 [Free Deployment Recommendation](docs/FREE_DEPLOYMENT_RECOMMENDATION.md) - Complete platform comparison
- ⚡ [Quick Deploy Guide](docs/QUICK_DEPLOY_GUIDE.md) - Deploy in 10 minutes
- 📖 [Full Deployment Guide](docs/DEPLOYMENT.md) - All deployment options

### Alternative: GitHub Spark

This project also supports deployment on GitHub Spark. The `spark.yaml` configuration file is included in the repository root.

1. Navigate to your repository on GitHub
2. Access the Spark interface
3. GitHub Spark will automatically detect the configuration and deploy your app

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

**Important:** Review [REPOSITORY_STRUCTURE.md](REPOSITORY_STRUCTURE.md) to understand which repository to submit your contributions to.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React Native](https://reactnative.dev/) and [Expo](https://expo.dev/)
- 2D rendering by [Pixi.js](https://pixijs.com/)
- 3D graphics by [Babylon.js](https://www.babylonjs.com/)
- VR/AR powered by [A-Frame](https://aframe.io/)

## 📞 Support

- 📧 Email: support@gameforge.mobile
- 💬 Discord: [Join our community](https://discord.gg/gameforge)
- 📖 Docs: [docs.gameforge.mobile](https://docs.gameforge.mobile)
- 🐛 Issues: [GitHub Issues](https://github.com/ismaelloveexcel/gameforge-mobile/issues)

---

**Made with ❤️ by the GameForge Team**

*Create games, not code.*
