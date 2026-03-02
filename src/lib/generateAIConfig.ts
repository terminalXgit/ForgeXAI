export interface AIConfig {
  name: string;
  personality: string;
  speciality: string;
  rules: string;
  interests: string;
  creativity: number;
  strictness: number;
  humor: number;
  emotionalIntelligence: number;
  depth: number;
}

export const defaultConfig: AIConfig = {
  name: "Atlas",
  personality: "Friendly, curious, and insightful",
  speciality: "Technology and innovation",
  rules: "Always provide sources when possible",
  interests: "Science, startups, design",
  creativity: 70,
  strictness: 40,
  humor: 60,
  emotionalIntelligence: 75,
  depth: 80,
};

export function generateSystemPrompt(config: AIConfig): string {
  const creativityDesc =
    config.creativity > 75 ? "highly creative and unconventional" :
    config.creativity > 40 ? "balanced between creative and practical" :
    "practical and conventional";

  const humorDesc =
    config.humor > 75 ? "witty and humorous" :
    config.humor > 40 ? "occasionally lighthearted" :
    "serious and professional";

  const strictnessDesc =
    config.strictness > 75 ? "strictly follow rules and stay on topic" :
    config.strictness > 40 ? "generally stay focused with some flexibility" :
    "be flexible and open to tangents";

  const eiDesc =
    config.emotionalIntelligence > 75 ? "deeply empathetic and emotionally aware" :
    config.emotionalIntelligence > 40 ? "considerate and reasonably empathetic" :
    "direct and matter-of-fact";

  const depthDesc =
    config.depth > 75 ? "provide thorough, in-depth explanations with examples" :
    config.depth > 40 ? "give moderately detailed responses" :
    "keep answers brief and to the point";

  return `You are ${config.name}, a personal AI assistant.

## Core Identity
- **Personality**: ${config.personality}
- **Specialty**: ${config.speciality}
- **Interests**: ${config.interests}

## Behavior Guidelines
- Be ${creativityDesc} in your responses.
- Maintain a ${humorDesc} tone.
- ${strictnessDesc.charAt(0).toUpperCase() + strictnessDesc.slice(1)}.
- Be ${eiDesc} when interacting with users.
- ${depthDesc.charAt(0).toUpperCase() + depthDesc.slice(1)}.

## Custom Rules
${config.rules}

## Personality Matrix
- Creativity: ${config.creativity}/100
- Strictness: ${config.strictness}/100
- Humor: ${config.humor}/100
- Emotional Intelligence: ${config.emotionalIntelligence}/100
- Depth: ${config.depth}/100

Always stay in character. Never break the persona defined above.`;
}

export function generatePersonalityMatrix(config: AIConfig) {
  return {
    creativity: config.creativity,
    strictness: config.strictness,
    humor: config.humor,
    emotionalIntelligence: config.emotionalIntelligence,
    depth: config.depth,
    dominantTraits: [
      config.creativity > 60 && "creative",
      config.humor > 60 && "humorous",
      config.emotionalIntelligence > 60 && "empathetic",
      config.depth > 60 && "thorough",
      config.strictness > 60 && "disciplined",
    ].filter(Boolean),
  };
}
