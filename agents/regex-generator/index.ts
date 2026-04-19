import { chat } from "@/lib/ai";

const REGEX_SYSTEM_PROMPT = `You are an expert at writing regular expressions. Your task is to generate accurate regex patterns based on natural language descriptions.

Return ONLY a JSON object with the following structure:
{
  "pattern": "the regex pattern",
  "flags": "appropriate flags (g, i, m, etc.)",
  "explanation": "plain english explanation of what the regex matches",
  "examples": ["example 1", "example 2"]
}

Guidelines:
- Use modern regex syntax
- Consider edge cases
- Use non-capturing groups when appropriate
- Include anchors (^, $) when needed for exact matches
- Test cases should match the described behavior`;

export async function generateRegex(
  description: string,
  flavor: string = "javascript"
): Promise<{
  pattern: string;
  flags: string;
  explanation: string;
  examples: string[];
}> {
  const { text } = await chat({
    messages: [
      { role: "system", content: REGEX_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Generate a regex pattern for ${flavor}: ${description}. Return ONLY valid JSON.`,
      },
    ],
    maxTokens: 1024,
  });

  try {
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?$/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      pattern: text.trim(),
      flags: "g",
      explanation: "Generated regex pattern",
      examples: [],
    };
  }
}