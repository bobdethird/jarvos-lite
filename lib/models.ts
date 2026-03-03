export const MODELS = [
  { id: "anthropic/claude-haiku-4.5", label: "Claude Haiku 4.5" },
  { id: "google/gemini-2.0-flash", label: "Gemini 2.0 Flash" },
  { id: "openai/gpt-5.2", label: "GPT-5.2" },
] as const;

export const DEFAULT_MODEL = MODELS[0].id;
