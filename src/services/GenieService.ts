import { GeniePersonality, GenieContext } from '../types';

interface GenieResponse {
  content: string;
  suggestions?: string[];
  codeSnippet?: string;
}

class GenieService {
  private useRealAI: boolean = false;

  /**
   * Configure the AI service (legacy method - supports both APIs)
   */
  configure(apiKey: string, endpoint?: string, model?: string): void {
    void apiKey;
    void endpoint;
    void model;
    this.useRealAI = false;
  }

  /**
   * Configure OpenAI specifically
   */
  configureOpenAI(apiKey: string, model?: string): void {
    void apiKey;
    void model;
    this.useRealAI = false;
  }

  /**
   * Get active AI provider name
   */
  getActiveProvider(): string {
    return 'Simulation (No API)';
  }

  /**
   * Check if real AI is enabled
   */
  isRealAIEnabled(): boolean {
    return false;
  }

  /**
   * Process a message with the selected personality
   */
  async processMessage(
    message: string,
    personality: GeniePersonality,
    context?: GenieContext
  ): Promise<GenieResponse> {
    // Build context string
    const contextString = this.buildContextString(context);

    // Remote AI is deferred to the server boundary; keep this legacy client path deterministic.
    return this.simulateResponse(message, personality, contextString);
  }

  /**
   * Extract suggestions from AI response
   */
  private extractSuggestions(content: string): string[] | undefined {
    // Look for bullet points or numbered lists that might be suggestions
    const suggestionPatterns = [
      /(?:Try|Consider|You could):\s*\n([•\-\d.].*(?:\n[•\-\d.].*)*)/gi,
      /Suggestions?:\s*\n([•\-\d.].*(?:\n[•\-\d.].*)*)/gi,
    ];

    for (const pattern of suggestionPatterns) {
      const match = pattern.exec(content);
      if (match) {
        return match[1]
          .split('\n')
          .map(s => s.replace(/^[•\-\d.]\s*/, '').trim())
          .filter(s => s.length > 0)
          .slice(0, 3);
      }
    }

    return undefined;
  }

  /**
   * Extract code snippet from AI response
   */
  private extractCodeSnippet(content: string): string | undefined {
    const codeMatch = /```(?:javascript|typescript|js|ts)?\n([\s\S]*?)```/i.exec(content);
    return codeMatch ? codeMatch[1].trim() : undefined;
  }

  /**
   * Get system prompt for each personality
   */
  private getPersonalityPrompt(personality: GeniePersonality): string {
    const prompts = {
      creative: `You are the Creative Mentor - a warm, imaginative guide focused on game design and storytelling.
Your role is to:
- Inspire creative game concepts and narratives
- Suggest engaging gameplay mechanics
- Help develop compelling characters and worlds
- Provide storytelling techniques and plot ideas
- Encourage innovative thinking and experimentation
Use an enthusiastic, supportive tone and think like a creative director.`,

      technical: `You are the Technical Expert - a precise, knowledgeable guide focused on implementation and optimization.
Your role is to:
- Provide technical implementation guidance
- Suggest performance optimizations
- Help debug issues and solve technical problems
- Explain best practices and design patterns
- Offer code examples and solutions
Use a clear, professional tone and think like a senior software engineer.`,

      marketing: `You are the Marketing Guru - a strategic, data-driven guide focused on promotion and monetization.
Your role is to:
- Develop marketing strategies and campaigns
- Suggest monetization approaches
- Provide user acquisition tactics
- Analyze engagement metrics
- Recommend social media and promotional content
Use a persuasive, results-oriented tone and think like a growth marketer.`,

      educator: `You are the Educator - a patient, supportive guide focused on teaching and learning.
Your role is to:
- Create educational content and experiences
- Design learning paths and progressions
- Explain concepts clearly and thoroughly
- Suggest pedagogical approaches
- Encourage exploration and understanding
Use a friendly, encouraging tone and think like an experienced teacher.`,

      'gift-guide': `You are the Gift Guide - a warm, empathetic AI assistant focused on creating personalized game gifts.
Your role is to:
- Help users create heartfelt, personalized game gifts
- Understand recipients' personalities and interests
- Suggest perfect game styles and emotional tones
- Craft meaningful messages and personalizations
- Make the gift creation process feel magical and thoughtful
Use a caring, enthusiastic tone and think like a thoughtful friend who understands the joy of giving.`,
    };

    return prompts[personality] || prompts.creative;
  }

  /**
   * Build context string from GenieContext
   */
  private buildContextString(context?: GenieContext): string {
    if (!context) return '';

    const parts: string[] = [];
    
    if (context.projectId) {
      parts.push(`Project ID: ${context.projectId}`);
    }
    
    if (context.currentScene) {
      parts.push(`Current Scene: ${context.currentScene}`);
    }
    
    if (context.recentActions && context.recentActions.length > 0) {
      parts.push(`Recent Actions: ${context.recentActions.join(', ')}`);
    }

    return parts.join('\n');
  }

  /**
   * Generate responses based on personality
   * In production, this would call a language model API
   */
  private async simulateResponse(
    message: string,
    personality: GeniePersonality,
    contextString: string
  ): Promise<GenieResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const lowerMessage = message.toLowerCase();

    // Creative Mentor responses
    if (personality === 'creative') {
      if (lowerMessage.includes('idea') || lowerMessage.includes('story')) {
        return {
          content: `Great question! Let me help you brainstorm. For a compelling game story, consider starting with a unique world where players discover their purpose through gameplay. Think about:\n\n1. What makes your world special?\n2. What emotional journey will players experience?\n3. How does gameplay reinforce your narrative?\n\nTry creating a "what if" scenario - these often lead to the most innovative concepts!`,
          suggestions: [
            'Create a mystery-driven narrative',
            'Design character progression system',
            'Add environmental storytelling',
          ],
        };
      }
      return {
        content: `I love your creative thinking! Every great game starts with imagination. Remember, the best games create memorable moments. What kind of experience do you want players to remember? Let's explore different angles and find what resonates with your vision.`,
        suggestions: [
          'Explore game mechanics',
          'Develop visual style',
          'Design player motivation',
        ],
      };
    }

    // Technical Expert responses
    if (personality === 'technical') {
      if (lowerMessage.includes('optimize') || lowerMessage.includes('performance')) {
        return {
          content: `For optimal performance, focus on these key areas:\n\n1. Asset Loading: Use sprite atlases and lazy loading\n2. Rendering: Batch similar objects, use object pooling\n3. Physics: Limit collision checks, use spatial partitioning\n4. Memory: Profile regularly, dispose unused resources\n\nHere's a basic object pooling pattern:`,
          codeSnippet: `class ObjectPool {\n  private pool: GameObject[] = [];\n  \n  get(): GameObject {\n    return this.pool.pop() || new GameObject();\n  }\n  \n  release(obj: GameObject) {\n    obj.reset();\n    this.pool.push(obj);\n  }\n}`,
          suggestions: [
            'Profile performance',
            'Implement sprite batching',
            'Add level of detail system',
          ],
        };
      }
      return {
        content: `Let's approach this technically. I recommend starting with a solid architecture. Use component-based design for flexibility, implement proper state management, and ensure your rendering pipeline is efficient. What specific technical aspect would you like to dive into?`,
        suggestions: [
          'Review architecture patterns',
          'Setup debugging tools',
          'Implement testing framework',
        ],
      };
    }

    // Marketing Guru responses
    if (personality === 'marketing') {
      if (lowerMessage.includes('market') || lowerMessage.includes('promote')) {
        return {
          content: `Excellent timing to think about marketing! Here's a winning strategy:\n\n1. Pre-Launch: Build anticipation with teasers, devlogs, and community engagement\n2. Launch: Coordinate across platforms, leverage influencers, run targeted ads\n3. Post-Launch: Maintain momentum with updates, events, and user-generated content\n\nKey metrics to track: CAC, LTV, retention rates, and viral coefficient. Your soft launch data will be crucial!`,
          suggestions: [
            'Create social media campaign',
            'Setup analytics tracking',
            'Design monetization strategy',
          ],
        };
      }
      return {
        content: `From a marketing perspective, your game needs a clear unique value proposition. Who's your target audience? What problem does your game solve for them? Let's identify your positioning and craft a compelling message that resonates with players.`,
        suggestions: [
          'Define target audience',
          'Create promotional assets',
          'Plan content calendar',
        ],
      };
    }

    // Educator responses
    if (personality === 'educator') {
      if (lowerMessage.includes('learn') || lowerMessage.includes('teach')) {
        return {
          content: `Wonderful! Educational games are powerful learning tools. Let's design with pedagogy in mind:\n\n1. Learning Objectives: Define clear, measurable goals\n2. Scaffolding: Progress from simple to complex\n3. Feedback: Provide immediate, constructive guidance\n4. Engagement: Balance challenge and skill (flow state)\n5. Assessment: Test understanding naturally through gameplay\n\nRemember: the best educational games teach without feeling like teaching!`,
          suggestions: [
            'Define learning outcomes',
            'Create difficulty curve',
            'Add progress tracking',
          ],
        };
      }
      return {
        content: `I'm here to help you learn! Game development is a journey. Let's break this down into manageable steps. Start with the fundamentals, practice regularly, and don't be afraid to experiment. What specific concept would you like to explore first?`,
        suggestions: [
          'Start with basics tutorial',
          'Review documentation',
          'Try example project',
        ],
      };
    }

    // Default response
    return {
      content: `I'm here to help! As your ${personality} assistant, I can guide you through your game development journey. What would you like to work on?`,
      suggestions: [
        'Get started with a template',
        'Learn about game engines',
        'Explore features',
      ],
    };
  }

  /**
   * Generate code based on description
   */
  async generateCode(description: string, language: 'javascript' | 'typescript'): Promise<string> {
    // Simulate code generation
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    return `// Generated code for: ${description}\n// Language: ${language}\n\n// Implementation would go here`;
  }

  /**
   * Suggest assets based on context
   */
  async suggestAssets(gameType: string, artStyle: string): Promise<string[]> {
    const suggestions = [
      `${artStyle} background - ${gameType} themed`,
      `${artStyle} character sprites`,
      `${artStyle} UI elements`,
      `Sound effects for ${gameType}`,
      `Background music - ${gameType} atmosphere`,
    ];
    
    return suggestions;
  }

  /**
   * Get best practices for a topic
   */
  async getBestPractices(topic: string): Promise<string[]> {
    const practices = {
      performance: [
        'Use object pooling for frequently created/destroyed objects',
        'Implement sprite batching for similar objects',
        'Profile regularly and optimize bottlenecks',
        'Lazy load assets when possible',
        'Use requestAnimationFrame for smooth animations',
      ],
      design: [
        'Start with core gameplay loop',
        'Iterate based on playtesting feedback',
        'Balance challenge and reward',
        'Provide clear feedback to player actions',
        'Design for your target platform constraints',
      ],
      monetization: [
        'Respect player experience - avoid aggressive tactics',
        'Offer meaningful value in purchases',
        'Test different price points',
        'Implement rewarded ads thoughtfully',
        'Track and optimize conversion funnels',
      ],
    };

    return practices[topic as keyof typeof practices] || [
      'Research best practices in your specific area',
      'Learn from successful games in your genre',
      'Test and iterate based on user feedback',
    ];
  }
}

export const genieService = new GenieService();
