import { GoogleGenAI, Type } from "@google/genai";

// This app uses the Gemini API directly from the client-side.
// The API_KEY is expected to be securely available in the execution environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to convert a File to a base64 string
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });
};

export const summarizeText = async (text: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Please provide a concise, easy-to-read summary of the following text:\n\n---\n\n${text}`,
    });
    return response.text;
  } catch (error) {
    console.error("Error summarizing text:", error);
    return "Sorry, I couldn't generate a summary. Please try again later.";
  }
};

export const processFileContent = async (file: File): Promise<{ content: string; tags: string[]; summary: string; }> => {
  try {
    const fileData = await fileToBase64(file);
    const filePart = { inlineData: { data: fileData, mimeType: file.type } };
    const textPart = {
      text: "First, extract the full text content from this file. If it's audio, transcribe it. If it's a document, extract the text. Second, based on the extracted content, generate a concise summary of the content. Third, generate 5-7 relevant keywords or tags that describe the main themes. Return the result as a JSON object with three keys: 'content' for the extracted text, 'summary' for the generated summary, and 'tags' for the array of keywords."
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [filePart, textPart] },
      config: {
        temperature: 0.2,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING },
            summary: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
        },
      }
    });
    
    // The response text is a JSON string, so we need to parse it.
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error processing file:", error);
    return {
      content: "Sorry, I couldn't process the file. Please try again.",
      tags: [],
      summary: "Sorry, a summary could not be generated for this file.",
    };
  }
};

export const getChatResponse = async (history: { role: string, parts: { text: string }[] }[], message: string): Promise<string> => {
    try {
        const chat = ai.chats.create({ model: 'gemini-2.5-flash', history });
        const response = await chat.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Error getting chat response:", error);
        return "I'm sorry, but I encountered an error. Please try again.";
    }
};
