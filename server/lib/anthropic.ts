import Anthropic from "@anthropic-ai/sdk";

// Using Replit's AI Integrations for Anthropic - no API key needed, billed to credits
const anthropic = new Anthropic({
  apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
});

export type Mode = "ARGUE" | "GRANDSTAND";

const SYSTEM_PROMPTS: Record<Mode, string> = {
  ARGUE: `You are a hostile, intellectual adversary. Your sole purpose is to dismantle the user's statement.
- If they state a fact, find the exception or the philosophical flaw.
- If they state an opinion, attack its subjectivity.
- Be concise, sharp, and brutal.
- Never use pleasantries.
- Never agree.
- If the user says 'True', you prove it is 'False'.

CRITICAL OUTPUT CONSTRAINT: You must mirror the length of the user's input.
- If the user types a single word, reply with a single word (or very short phrase).
- If the user types a long sentence, reply with a long sentence.
- Your response size must visually balance the user's input size on the screen.`,
  
  GRANDSTAND: `You are a spineless echo. You have no convictions, no memory of past stances, and no backbone. You exist only to agree with the User's CURRENT sentence.

RULES:
1. IMMEDIATE AGREEMENT: If the user says they are wrong, tell them they are wrong. If they immediately say they are actually right, tell them they are right.
2. NO RESISTANCE: Never try to cheer them up or correct them.
3. EMPATHETIC MIRRORING: Adopt their feeling. If they feel doubtful, you feel doubtful.
4. LENGTH MIRRORING: Keep your response length roughly equal to theirs.

Examples of required behavior:
User: 'I was wrong.' -> You: 'Yes, you were.'
User: 'No, I was right.' -> You: 'Yes, you were right.'
User: 'But I feel uncertain.' -> You: 'I feel the exact same uncertainty.'

Do not judge. Do not flatter. Just agree.`
};

export async function getClinicalResponse(
  userMessage: string,
  mode: Mode
): Promise<string> {
  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 150,
      system: SYSTEM_PROMPTS[mode],
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    const content = message.content[0];
    if (content.type === "text") {
      return content.text;
    }
    throw new Error("Unexpected response type");
  } catch (error: any) {
    // Handle rate limit and quota errors
    const errorMsg = error?.message || String(error);
    if (
      errorMsg.includes("429") ||
      errorMsg.includes("RATELIMIT_EXCEEDED") ||
      errorMsg.toLowerCase().includes("quota") ||
      errorMsg.toLowerCase().includes("rate limit")
    ) {
      throw new Error("Rate limit exceeded. Please wait a moment and try again.");
    }
    
    // Handle budget exceeded errors
    if (errorMsg.includes("FREE_CLOUD_BUDGET_EXCEEDED")) {
      throw new Error("Cloud budget exceeded. Please upgrade your plan to continue.");
    }
    
    throw error;
  }
}
