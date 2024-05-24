import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenerativeAIStream, StreamingTextResponse } from 'ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

// Predefined prompt
const predefinedPrompt = {
  contents: [{
    role: 'user',
    parts: [{
      text: "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What is a hobby you have recently started?||If you could have dinner with any historical figure, who would it be?||What is a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."
    }]
  }]
};

export async function POST(req: Request) {
  try {
    // Generate the content stream using the Google Generative AI SDK with the free Gemini model
    const geminiStream = await genAI
      .getGenerativeModel({ model: 'gemini-1.5-flash-latest' }) // Assuming 'gemini' is the free version model name
      .generateContentStream(predefinedPrompt);
  
    // Convert the response into a friendly text-stream
    const stream = GoogleGenerativeAIStream(geminiStream);
  
    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (error) {
    return Response.json({
        success: false,
        message: "No data returned from gemini-1.5-flash-latest model"
    }, {status: 500});
  }
}
