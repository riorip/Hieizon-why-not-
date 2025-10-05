import { GoogleGenAI } from '@google/genai';
import { Article } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchNews = async (category: string): Promise<Article[]> => {
    // Fix: Simplified the prompt to request fewer articles and shorter content to mitigate potential
    // server-side timeout errors (500 errors) by reducing the complexity of the generation task.
    const prompt = `
      Act as a news API. Your response must be a single, valid JSON object, with no other text or markdown.
      Find 3 recent and significant news articles for the category: "${category}", using Google Search.
      
      The JSON object must have a root key "articles" containing an array of 3 article objects.
      Each article object must have this exact structure:
      - id: A unique UUID.
      - headline: The article headline.
      - subheadline: A one-sentence summary.
      - summaryPoints: An array of 3 key bullet points.
      - content: An article of about 150 words.
      - imageUrl: A relevant image URL. Use a placeholder like "https://picsum.photos/seed/a-unique-string/1200/800" if a real one isn't found.
      - sourceUri: The original source URL from search.
      - sourceTitle: The original source title.

      CRITICAL: The entire output must be only the JSON object. Ensure all strings are correctly quoted and special characters are escaped (e.g., "The speaker said \\"It's a success.\\"").
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
                temperature: 0.7,
            },
        });
        
        let jsonText = response.text.trim();
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.substring(7, jsonText.length - 3).trim();
        } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.substring(3, jsonText.length - 3).trim();
        }
        
        const parsed = JSON.parse(jsonText);
        
        if (parsed && parsed.articles && Array.isArray(parsed.articles)) {
            return parsed.articles;
        } else {
            console.error("Parsed JSON does not match expected structure:", parsed);
            return [];
        }

    } catch (error) {
        console.error("Error fetching or parsing news from Gemini API:", error);
        throw new Error("Failed to retrieve news from Gemini API.");
    }
};