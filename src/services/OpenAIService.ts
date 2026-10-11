/**
 * OpenAIService - legacy client compatibility layer.
 *
 * Provider calls are intentionally disabled in the client. AI generation will
 * move behind the Phase 1 server boundary.
 */

import {
  GiftForgeQuestionnaire,
  GeneratedGiftGame,
  OCCASION_LABELS,
  AGE_LABELS,
  PERSONALITY_LABELS,
  INTEREST_LABELS,
  RELATIONSHIP_LABELS,
  TONE_LABELS,
  GAME_TYPE_LABELS,
  GAME_LENGTH_LABELS,
  VISUAL_STYLE_LABELS,
  IntroScreen,
  EndScreen,
  GameContent,
  DialogueItem,
  GameLevel,
  QuizQuestion,
  StoryBranch,
} from '../types/giftforge';

export interface OpenAIConfig {
  apiKey: string;
  model?: string;
  baseUrl?: string;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIResponse {
  success: boolean;
  content?: string;
  error?: string;
}

export interface GiftGameGenerationResult {
  success: boolean;
  game?: GeneratedGiftGame;
  error?: string;
}

class OpenAIService {
  private apiKey: string = '';
  private model: string = 'gpt-4o-mini'; // Cost-effective model for most tasks
  private isConfigured: boolean = false;

  /**
   * Legacy compatibility method. Secrets are deliberately not retained by
   * the client; configure the Phase 1 server instead.
   */
  configure(config: OpenAIConfig): void {
    void config.apiKey;
    if (config.model) this.model = config.model;
    this.apiKey = '';
    this.isConfigured = false;
  }

  /**
   * Check if OpenAI is properly configured
   */
  isReady(): boolean {
    return this.isConfigured && !!this.apiKey;
  }

  /**
   * Set the model to use
   */
  setModel(model: string): void {
    this.model = model;
  }

  /**
   * Generic chat completion
   */
  async chat(
    messages: ChatMessage[],
    options?: {
      temperature?: number;
      maxTokens?: number;
      responseFormat?: 'text' | 'json_object';
    }
  ): Promise<OpenAIResponse> {
    void messages;
    void options;
    return {
      success: false,
      error: 'Server-side AI is not configured in the client',
    };
  }

  /**
   * Simple text completion with a single prompt
   */
  async complete(prompt: string, systemPrompt?: string): Promise<OpenAIResponse> {
    const messages: ChatMessage[] = [];
    
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    
    messages.push({ role: 'user', content: prompt });
    
    return this.chat(messages);
  }

  /**
   * Generate a personalized gift message
   */
  async generateGiftMessage(
    recipientName: string,
    senderName: string,
    occasion: string,
    tone: string,
    interests?: string[]
  ): Promise<string> {
    const systemPrompt = `You are a creative writer specializing in heartfelt, personalized gift messages. 
Write warm, genuine messages that feel personal and touching. Keep messages concise (under 150 words) but meaningful.`;

    const prompt = `Write a ${tone} gift message for ${recipientName} from ${senderName} for ${occasion}.
${interests && interests.length > 0 ? `They enjoy: ${interests.join(', ')}.` : ''}
Make it personal, heartfelt, and memorable. Keep it under 150 words.`;

    const response = await this.complete(prompt, systemPrompt);
    
    if (response.success && response.content) {
      return response.content.trim();
    }
    
    // Fallback message
    return this.getFallbackMessage(recipientName, senderName, occasion);
  }

  /**
   * Generate a complete gift game using OpenAI
   */
  async generateGiftGame(questionnaire: GiftForgeQuestionnaire): Promise<GiftGameGenerationResult> {
    const systemPrompt = `You are a creative game designer specializing in personalized gift experiences. 
Your task is to create heartfelt, age-appropriate, and engaging mini-game content.
Always respond with valid JSON only, no additional text or markdown.`;

    const prompt = this.buildGamePrompt(questionnaire);

    const response = await this.chat(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      {
        temperature: 0.8,
        maxTokens: 3000,
        responseFormat: 'json_object',
      }
    );

    if (!response.success || !response.content) {
      // Fall back to local generation
      return this.generateFallbackGame(questionnaire);
    }

    try {
      const gameData = JSON.parse(response.content);
      
      const game: GeneratedGiftGame = {
        id: this.generateGameId(),
        title: gameData.title || `Gift for ${questionnaire.recipientName}`,
        recipientName: questionnaire.recipientName,
        senderName: questionnaire.senderName,
        introScreen: gameData.introScreen || this.generateIntroScreen(questionnaire),
        endScreen: gameData.endScreen || this.generateEndScreen(questionnaire),
        gameContent: gameData.gameContent || this.generateGameContent(questionnaire),
        visualStyle: questionnaire.visualStyle,
        createdAt: new Date(),
      };

      return {
        success: true,
        game,
      };
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      return this.generateFallbackGame(questionnaire);
    }
  }

  /**
   * Generate creative suggestions
   */
  async generateSuggestions(
    category: 'game-ideas' | 'improvements' | 'features' | 'themes' | 'occasions',
    context: string,
    count: number = 5
  ): Promise<string[]> {
    const prompt = `Generate ${count} creative ${category} suggestions for: ${context}
Respond with a JSON array of strings only.`;

    const response = await this.chat(
      [{ role: 'user', content: prompt }],
      { responseFormat: 'json_object' }
    );

    if (response.success && response.content) {
      try {
        const parsed = JSON.parse(response.content);
        if (Array.isArray(parsed)) return parsed.slice(0, count);
        if (parsed.suggestions) return parsed.suggestions.slice(0, count);
      } catch {
        // Parse failed, return fallback
      }
    }

    return this.getFallbackSuggestions(category, count);
  }

  /**
   * Enhance text with AI
   */
  async enhanceText(
    text: string,
    enhancement: 'emotional' | 'professional' | 'funny' | 'romantic' | 'simplify'
  ): Promise<string> {
    const prompts: Record<string, string> = {
      emotional: `Make this text more emotional and heartfelt while keeping its core meaning: "${text}"`,
      professional: `Make this text more professional and polished: "${text}"`,
      funny: `Add gentle humor to this text while keeping its meaning: "${text}"`,
      romantic: `Make this text more romantic and touching: "${text}"`,
      simplify: `Simplify this text for better clarity: "${text}"`,
    };

    const response = await this.complete(prompts[enhancement] || prompts.emotional);
    
    return response.success && response.content ? response.content.trim() : text;
  }

  /**
   * Generate game dialogue
   */
  async generateDialogue(
    character: string,
    situation: string,
    mood: string,
    recipientName?: string
  ): Promise<string> {
    const prompt = `Generate dialogue for ${character} who is ${mood} in this situation: ${situation}.
${recipientName ? `The dialogue is for a gift game for ${recipientName}.` : ''}
Make it natural, warm, and character-appropriate. Keep it to 1-2 sentences.`;

    const response = await this.complete(prompt);
    
    return response.success && response.content 
      ? response.content.trim() 
      : `[${character}]: ...`;
  }

  // ========== PRIVATE HELPER METHODS ==========

  /**
   * Build the detailed prompt for game generation
   */
  private buildGamePrompt(questionnaire: GiftForgeQuestionnaire): string {
    const occasionLabel = OCCASION_LABELS[questionnaire.occasion] || questionnaire.occasion;
    const ageLabel = AGE_LABELS[questionnaire.recipientAge] || 'young adult';
    const personalityLabels = questionnaire.recipientPersonalities
      .map(p => PERSONALITY_LABELS[p] || p)
      .join(', ');
    const interestLabels = questionnaire.recipientInterests
      .map(i => INTEREST_LABELS[i] || i)
      .join(', ');
    const relationshipLabel = RELATIONSHIP_LABELS[questionnaire.relationship] || questionnaire.relationship;
    const toneLabel = TONE_LABELS[questionnaire.tone] || questionnaire.tone;
    const gameTypeLabel = GAME_TYPE_LABELS[questionnaire.gameType] || questionnaire.gameType;
    const gameLengthLabel = GAME_LENGTH_LABELS[questionnaire.gameLength] || '5-10 minutes';
    const visualStyleLabel = VISUAL_STYLE_LABELS[questionnaire.visualStyle] || questionnaire.visualStyle;

    return `Create a personalized gift mini-game with these specifications:

## Recipient Details
- Name: ${questionnaire.recipientName}
- Age Group: ${ageLabel}
- Personalities: ${personalityLabels || 'fun-loving'}
- Interests: ${interestLabels || 'general fun'}

## Gift Context
- Occasion: ${occasionLabel}
- From: ${questionnaire.senderName}
- Relationship: ${relationshipLabel}
- Tone: ${toneLabel}

## Game Specifications
- Type: ${gameTypeLabel}
- Length: ${gameLengthLabel}
- Visual Style: ${visualStyleLabel}

## Personal Message
"${questionnaire.personalMessage || `Made with love for ${questionnaire.recipientName}`}"

Generate a JSON response with this structure:
{
  "title": "Creative personalized game title",
  "introScreen": {
    "headline": "Welcoming headline for ${questionnaire.recipientName}",
    "subtext": "A warm intro message matching the ${toneLabel} tone",
    "buttonText": "Engaging call-to-action"
  },
  "endScreen": {
    "headline": "Celebratory completion message",
    "personalMessage": "The personal message transformed into a touching finale",
    "senderSignature": "With love, ${questionnaire.senderName}"
  },
  "gameContent": {
    "type": "${questionnaire.gameType}",
    "dialogue": [
      {"character": "Guide", "text": "...", "emotion": "happy"}
    ],
    "mechanics": [{"type": "...", "description": "...", "parameters": {}}]
    ${questionnaire.gameType === 'runner' ? ',"levels": [{"id": 1, "name": "...", "description": "...", "objectives": ["..."]}]' : ''}
    ${['puzzle_challenges', 'educational_playful'].includes(questionnaire.gameType) ? ',"questions": [{"question": "...", "options": ["..."], "correctAnswer": 0, "encouragingFeedback": "..."}]' : ''}
    ${['story_choices', 'adventure_quest'].includes(questionnaire.gameType) ? ',"storyBranches": [{"id": "start", "text": "...", "choices": [{"text": "...", "nextBranchId": "...", "reaction": "..."}]}]' : ''}
  }
}

Requirements:
1. Age-appropriate for ${ageLabel}
2. Personalized with references to interests (${interestLabels})
3. Match the ${toneLabel} emotional tone
4. Include encouraging, joyful moments
5. End with heartwarming message incorporating sender's note`;
  }

  /**
   * Generate fallback game when API is unavailable
   */
  private async generateFallbackGame(questionnaire: GiftForgeQuestionnaire): Promise<GiftGameGenerationResult> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const game: GeneratedGiftGame = {
      id: this.generateGameId(),
      title: this.generateTitle(questionnaire),
      recipientName: questionnaire.recipientName,
      senderName: questionnaire.senderName,
      introScreen: this.generateIntroScreen(questionnaire),
      endScreen: this.generateEndScreen(questionnaire),
      gameContent: this.generateGameContent(questionnaire),
      visualStyle: questionnaire.visualStyle,
      createdAt: new Date(),
    };

    return { success: true, game };
  }

  /**
   * Generate a creative game title
   */
  private generateTitle(questionnaire: GiftForgeQuestionnaire): string {
    const titles: Record<string, string[]> = {
      birthday: [
        `${questionnaire.recipientName}'s Birthday Adventure`,
        `Happy Birthday, ${questionnaire.recipientName}!`,
        `A Special Day for ${questionnaire.recipientName}`,
      ],
      anniversary: [
        `Our Journey Together`,
        `Celebrating Us: A Love Story`,
        `${questionnaire.recipientName}'s Anniversary Quest`,
      ],
      valentines: [
        `With Love to ${questionnaire.recipientName}`,
        `A Valentine's Journey for You`,
        `Hearts & Adventures`,
      ],
      ramadan: [
        `Ramadan Blessings for ${questionnaire.recipientName}`,
        `A Blessed Journey`,
        `${questionnaire.recipientName}'s Ramadan Adventure`,
      ],
      eid: [
        `Eid Mubarak, ${questionnaire.recipientName}!`,
        `${questionnaire.recipientName}'s Eid Celebration`,
        `A Joyful Eid Journey`,
      ],
      just_because: [
        `Just for ${questionnaire.recipientName}`,
        `A Surprise Adventure`,
        `Because ${questionnaire.recipientName} is Awesome!`,
      ],
    };

    const occasionTitles = titles[questionnaire.occasion] || titles.just_because;
    return occasionTitles[Math.floor(Math.random() * occasionTitles.length)];
  }

  /**
   * Generate intro screen content
   */
  private generateIntroScreen(questionnaire: GiftForgeQuestionnaire): IntroScreen {
    const toneIntros: Record<string, string> = {
      heartfelt: `${questionnaire.senderName} has created something special just for you...`,
      playful: `Hey ${questionnaire.recipientName}! Ready for some fun?`,
      nostalgic: `A little trip down memory lane awaits you...`,
      encouraging: `You've got this, ${questionnaire.recipientName}! Let's go!`,
      romantic: `My dearest ${questionnaire.recipientName}, this is for you...`,
      humorous: `Warning: Extreme fun ahead! Proceed with joy!`,
      inspirational: `Every great journey begins with a single step...`,
    };

    return {
      headline: `Welcome, ${questionnaire.recipientName}! 🎉`,
      subtext: toneIntros[questionnaire.tone] || toneIntros.heartfelt,
      buttonText: 'Start Your Adventure! ✨',
    };
  }

  /**
   * Generate end screen content
   */
  private generateEndScreen(questionnaire: GiftForgeQuestionnaire): EndScreen {
    const occasionEndings: Record<string, string> = {
      birthday: 'Happy Birthday! May this year bring you endless joy! 🎂',
      anniversary: 'Here\'s to many more wonderful years together! 💕',
      valentines: 'You mean the world to me! 💝',
      ramadan: 'Ramadan Mubarak! May your days be filled with peace and blessings! 🌙',
      eid: 'Eid Mubarak! Wishing you joy, love, and happiness! 🎊',
      just_because: 'Just wanted you to know how special you are! ⭐',
    };

    return {
      headline: occasionEndings[questionnaire.occasion] || '🎉 You did it!',
      personalMessage: questionnaire.personalMessage || `Made with love for ${questionnaire.recipientName}`,
      senderSignature: `With love, ${questionnaire.senderName} 💝`,
    };
  }

  /**
   * Generate game content based on game type
   */
  private generateGameContent(questionnaire: GiftForgeQuestionnaire): GameContent {
    const dialogue: DialogueItem[] = [
      {
        character: 'Guide',
        text: `Welcome, ${questionnaire.recipientName}! ${questionnaire.senderName} prepared this special adventure for you!`,
        emotion: 'happy',
      },
      {
        character: 'Guide',
        text: 'Let\'s make some wonderful memories together!',
        emotion: 'celebrating',
      },
    ];

    const content: GameContent = {
      type: questionnaire.gameType,
      dialogue,
      mechanics: [
        { type: 'progress', description: 'Track your journey', parameters: { stages: 3 } },
      ],
    };

    // Add type-specific content
    switch (questionnaire.gameType) {
      case 'runner':
        content.levels = [
          { id: 1, name: 'Getting Started', description: 'Warm up!', objectives: ['Collect 5 items'] },
          { id: 2, name: 'Picking Up Speed', description: 'Keep going!', objectives: ['Collect 10 items'] },
          { id: 3, name: 'The Final Sprint', description: 'Almost there!', objectives: ['Reach the end!'] },
        ];
        break;
      case 'puzzle_challenges':
      case 'educational_playful':
        content.questions = [
          {
            question: `What makes ${questionnaire.recipientName} awesome?`,
            options: ['Everything!', 'Their smile', 'Their kindness', 'All of the above'],
            correctAnswer: 3,
            encouragingFeedback: 'Absolutely right! ✨',
          },
        ];
        break;
      case 'story_choices':
      case 'adventure_quest':
        content.storyBranches = [
          {
            id: 'start',
            text: `${questionnaire.recipientName}, your adventure begins! ${questionnaire.senderName} has hidden a special surprise...`,
            choices: [
              { text: 'Follow the sparkling path', nextBranchId: 'finale', reaction: 'Great choice!' },
              { text: 'Check the mysterious door', nextBranchId: 'finale', reaction: 'How adventurous!' },
            ],
          },
          {
            id: 'finale',
            text: `Congratulations! You found the surprise! 🎉`,
            choices: [],
          },
        ];
        break;
    }

    return content;
  }

  /**
   * Generate a unique game ID
   */
  private generateGameId(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 8);
    return `gift-${timestamp}-${randomPart}`;
  }

  /**
   * Fallback gift message
   */
  private getFallbackMessage(recipientName: string, senderName: string, occasion: string): string {
    const messages: Record<string, string> = {
      birthday: `Happy Birthday ${recipientName}! 🎉 Wishing you a day filled with joy and wonderful memories. With love, ${senderName} ❤️`,
      anniversary: `Happy Anniversary ${recipientName}! 💕 Celebrating another year of wonderful moments together. Love, ${senderName}`,
      valentines: `Happy Valentine's Day ${recipientName}! 💘 You make every day brighter. With all my love, ${senderName}`,
      ramadan: `Ramadan Mubarak ${recipientName}! 🌙 May this blessed month bring you peace and joy. With love, ${senderName}`,
      eid: `Eid Mubarak ${recipientName}! 🎊 Wishing you joy and blessings. With love, ${senderName}`,
      default: `Dear ${recipientName}, thinking of you and sending warm wishes! With love, ${senderName} 💝`,
    };

    return messages[occasion.toLowerCase()] || messages.default;
  }

  /**
   * Fallback suggestions
   */
  private getFallbackSuggestions(category: string, count: number): string[] {
    const fallbacks: Record<string, string[]> = {
      'game-ideas': ['Adventure Quest', 'Memory Match', 'Puzzle Challenge', 'Story Journey', 'Trivia Fun'],
      'improvements': ['Add animations', 'Include music', 'Add achievements', 'Improve UI', 'Add sharing'],
      'features': ['Leaderboards', 'Daily challenges', 'Rewards', 'Multiplayer', 'Themes'],
      'themes': ['Valentine\'s Romance', 'Ramadan Nights', 'Eid Celebration', 'Birthday Bash', 'Adventure'],
      'occasions': ['Valentine\'s Day', 'Ramadan', 'Eid', 'Birthday', 'Anniversary'],
    };

    return (fallbacks[category] || fallbacks['game-ideas']).slice(0, count);
  }
}

// Export singleton instance
export const openAIService = new OpenAIService();
export default openAIService;
