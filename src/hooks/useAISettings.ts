import { get, set } from 'idb-keyval';

const API_KEY_KEY = 'lo-note-api-key';
const AI_PROVIDER_KEY = 'lo-note-ai-provider';

export type AIProvider = 'openai' | 'gemini';

export interface AISettings {
    apiKey: string | null;
    provider: AIProvider;
}

export async function getAISettings(): Promise<AISettings> {
    const apiKey = await get<string>(API_KEY_KEY);
    const provider = await get<AIProvider>(AI_PROVIDER_KEY);
    return {
        apiKey: apiKey ?? null,
        provider: provider ?? 'openai',
    };
}

export async function saveAISettings(settings: AISettings): Promise<void> {
    await set(API_KEY_KEY, settings.apiKey);
    await set(AI_PROVIDER_KEY, settings.provider);
}

// Custom transport that uses the stored API key
export function createAITransport(apiKey: string, provider: AIProvider) {
    const baseUrl = provider === 'openai'
        ? 'https://api.openai.com/v1'
        : 'https://generativelanguage.googleapis.com/v1beta';

    return {
        async streamText(params: { messages: any[]; system?: string }) {
            if (provider === 'openai') {
                const response = await fetch(`${baseUrl}/chat/completions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`,
                    },
                    body: JSON.stringify({
                        model: 'gpt-4o-mini',
                        stream: true,
                        messages: [
                            ...(params.system ? [{ role: 'system', content: params.system }] : []),
                            ...params.messages,
                        ],
                    }),
                });

                if (!response.ok) {
                    const error = await response.text();
                    throw new Error(`OpenAI API error: ${error}`);
                }

                return response;
            } else {
                // Gemini API
                const model = 'gemini-pro';
                const prompt = params.messages.map((m: any) => `${m.role}: ${m.content}`).join('\n');
                const fullPrompt = params.system ? `${params.system}\n\n${prompt}` : prompt;

                const response = await fetch(
                    `${baseUrl}/models/${model}:streamGenerateContent?key=${apiKey}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: fullPrompt }] }],
                        }),
                    }
                );

                if (!response.ok) {
                    const error = await response.text();
                    throw new Error(`Gemini API error: ${error}`);
                }

                return response;
            }
        },
    };
}
