const axios = require('axios');
const pdfParse = require('pdf-parse');
const Flashcard = require('../models/Flashcard');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const callGroqAPI = async (prompt) => {
    try {
        const response = await axios.post(
            GROQ_API_URL,
            {
                model: 'llama-3.1-8b-instant',
                messages: [{ role: 'user', content: prompt }],
                response_format: { type: 'json_object' }
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Groq API Error:', error.response ? error.response.data : error.message);
        throw new Error('Failed to generate content from AI');
    }
};

const parseAIResponse = (text) => {
    try {
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');
        
        if (start === -1 || end === -1) {
            const startArr = text.indexOf('[');
            const endArr = text.lastIndexOf(']');
            if (startArr !== -1 && endArr !== -1) {
                const cleanedArr = text.substring(startArr, endArr + 1);
                return { items: JSON.parse(cleanedArr) };
            }
            throw new Error("No JSON object found in response");
        }

        const cleaned = text.substring(start, end + 1);
        return JSON.parse(cleaned);
    } catch (e) {
        console.error("Failed to parse AI output. Original text:", text);
        console.error("Error:", e.message);
        throw new Error("Invalid output format from AI. Please try again.");
    }
};

const normalizeAIItem = (item) => {
    const normalized = { ...item };
    
    if (!normalized.question) {
        normalized.question = item.q || item.query || item.prompt || item.text || item.problem;
    }
    
    if (!normalized.answer) {
        normalized.answer = item.a || item.response || item.result || item.explanation || item.solution;
    }

    if (!normalized.difficulty) {
        normalized.difficulty = item.diff || item.level || 'medium';
    }

    return normalized;
};

const getUnifiedPrompt = (params) => {
    const { mode, topic = '', text = '', count = 5, question = '', correctAnswer = '', userAnswer = '' } = params;

    let formatInstructions = '';
    if (mode === 'topic') {
        formatInstructions = `Return ONLY the following JSON structure:
{
"items": [
{
"question": "string",
"answer": "string",
"difficulty": "easy | medium | hard"
}
]
}`;
    } else if (mode === 'pdf') {
        formatInstructions = `Return ONLY the following JSON structure:
{
"items": [
{
"question": "string",
"answer": "string",
"difficulty": "easy | medium | hard",
"topic": "string"
}
]
}`;
    } else if (mode === 'explain') {
         formatInstructions = `Return ONLY the following JSON structure:
{
"explanation": "string"
}`;
    } else if (mode === 'quiz' || mode === 'pdf-quiz') {
         formatInstructions = `Return ONLY the following JSON structure:
{
"items": [
{
"question": "string",
"choices": ["Option 1", "Option 2", "Option 3", "Option 4"],
"correctAnswer": "Option 1"
}
]
}`;
    }


    let contextInstructions = '';
    if (text) {
        contextInstructions = `SOURCE MATERIAL (Use ONLY the following text to generate items):
---
${text}
---`;
    }

    return `Act as an expert teacher, instructional designer, and AI study coach.
You are powering a smart study application that generates high-quality learning materials.

INPUT:
Mode: ${mode}
Topic: ${topic}
Number of items: ${count}
${question ? `Question: ${question}` : ''}
${correctAnswer ? `Correct Answer: ${correctAnswer}` : ''}
${userAnswer ? `Student Answer: ${userAnswer}` : ''}

${contextInstructions}

GENERAL RULES:
* Always prioritize clarity and learning effectiveness
* Avoid unnecessary or repetitive content
* Focus on key concepts
* Answer length for flashcards: MUST be extremely concise (1-3 words maximum, ideally 1-2 words).
* Output MUST be valid JSON only

${formatInstructions}`;
};

// @desc    Generate flashcards from topic
// @route   POST /api/ai/topic
const generateFromTopic = async (req, res, next) => {
    try {
        const { topic, count, userId } = req.body;
        
        if (!topic || !userId) {
            res.status(400);
            throw new Error('Topic and userId are required');
        }

        const prompt = getUnifiedPrompt({ mode: 'topic', topic, count: count || 5 });
        const aiResponse = await callGroqAPI(prompt);
        
        const parsedData = parseAIResponse(aiResponse);
        const flashcardsData = parsedData.items || [];
        
        // Save generated flashcards to DB
        const savedFlashcards = await Promise.all(
            flashcardsData.map(async (item) => {
                return await Flashcard.create({
                    userId,
                    question: item.question,
                    answer: item.answer,
                    difficulty: item.difficulty,
                    topic: topic,
                    source: 'ai'
                });
            })
        );
        
        res.status(200).json(savedFlashcards);
    } catch (error) {
        next(error);
    }
};

// @desc    Upload PDF and generate flashcards or quiz
// @route   POST /api/ai/pdf
const generateFromPDF = async (req, res, next) => {
    try {
        const file = req.file;
        const { userId, count, type } = req.body;

        if (!file || !userId) {
            res.status(400);
            throw new Error('PDF file and userId are required');
        }

        const pdfData = await pdfParse(file.buffer);
        let text = pdfData.text || '';
        
        text = text.replace(/\s+/g, ' ').trim();

        if (!text || text.length < 20) {
            console.error('Empty or insufficient text extracted from PDF. Length:', text.length);
            res.status(400);
            throw new Error('Could not extract enough text from this PDF. Please ensure it is not a scanned image and contains readable text.');
        }

        const truncatedText = text.substring(0, 10000);
        
        const mode = type === 'quiz' ? 'pdf-quiz' : 'pdf';
        const prompt = getUnifiedPrompt({ mode, text: truncatedText, count: count || 10 });
        
        console.log(`Generating ${mode} from PDF. Extracted text length: ${text.length}`);
        
        const aiResponse = await callGroqAPI(prompt);
        const parsedData = parseAIResponse(aiResponse);
        
        let generatedItems = parsedData.items || [];
        if (!Array.isArray(generatedItems) || generatedItems.length === 0) {
            const firstArrayKey = Object.keys(parsedData).find(key => 
                Array.isArray(parsedData[key]) && parsedData[key].length > 0
            );
            if (firstArrayKey) {
                generatedItems = parsedData[firstArrayKey];
            } else if (Array.isArray(parsedData)) {
                generatedItems = parsedData;
            }
        }

        if (generatedItems.length === 0) {
            console.error('AI returned no valid items. Full response:', aiResponse);
            res.status(422);
            throw new Error('AI could not generate any study material from this PDF content. Try a different part of the document or a more descriptive PDF.');
        }

        if (type === 'quiz') {
            return res.status(200).json(generatedItems);
        }

        const savedFlashcards = [];
        const errors = [];

        for (const item of generatedItems) {
            try {
                const normalizedItem = normalizeAIItem(item);
                
                if (!normalizedItem.question || !normalizedItem.answer) {
                    continue;
                }

                const created = await Flashcard.create({
                    userId,
                    question: normalizedItem.question,
                    answer: normalizedItem.answer,
                    difficulty: normalizedItem.difficulty.toLowerCase().includes('easy') ? 'easy' : 
                               normalizedItem.difficulty.toLowerCase().includes('hard') ? 'hard' : 'medium',
                    topic: normalizedItem.topic || 'PDF Extraction',
                    source: 'pdf'
                });
                savedFlashcards.push(created);
            } catch (dbErr) {
                console.error('Error saving individual flashcard:', dbErr.message);
                errors.push(dbErr.message);
            }
        }

        if (savedFlashcards.length === 0) {
            res.status(422);
            throw new Error(`Failed to save any flashcards. ${errors.length > 0 ? 'Database Errors: ' + errors.join(', ') : 'The AI generated data was incomplete.'}`);
        }

        console.log(`Successfully saved ${savedFlashcards.length} flashcards from PDF.`);
        res.status(200).json(savedFlashcards);
    } catch (error) {
        next(error);
    }
};

// @desc    Explain wrong answer
// @route   POST /api/ai/explain
const explainAnswer = async (req, res, next) => {
    try {
        const { question, correctAnswer, userAnswer } = req.body;

        if (!question || !correctAnswer || !userAnswer) {
            res.status(400);
            throw new Error('Question, correctAnswer, and userAnswer are required');
        }

        const prompt = getUnifiedPrompt({ mode: 'explain', question, correctAnswer, userAnswer });
        const aiResponse = await callGroqAPI(prompt);
        
        const parsedData = parseAIResponse(aiResponse);

        res.status(200).json(parsedData);
    } catch (error) {
        next(error);
    }
};

// @desc    Generate quiz from topic
// @route   POST /api/ai/quiz
const generateQuiz = async (req, res, next) => {
    try {
        const { topic, count } = req.body;

        if (!topic) {
            res.status(400);
            throw new Error('Topic is required');
        }

        const prompt = getUnifiedPrompt({ mode: 'quiz', topic, count: count || 5 });
        const aiResponse = await callGroqAPI(prompt);
        
        const parsedData = parseAIResponse(aiResponse);

        res.status(200).json(parsedData.items || []);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    generateFromTopic,
    generateFromPDF,
    explainAnswer,
    generateQuiz
};
