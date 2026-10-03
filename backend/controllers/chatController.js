const { GoogleGenerativeAI } = require('@google/generative-ai');

// @desc    Handle chat messages
// @route   POST /api/chat
// @access  Public (rate-limited in server.js)
exports.handleChat = async (req, res, next) => {
    try {
        const { message } = req.body;

        // Input validation
        if (!message || typeof message !== 'string') {
            return res.status(400).json({ success: false, error: 'Message is required' });
        }

        // Message length limit
        if (message.length > 1000) {
            return res.status(400).json({ success: false, error: 'Message too long. Maximum 1000 characters.' });
        }

        // Check if Gemini API key is configured
        if (!process.env.GEMINI_API_KEY) {
            console.warn('GEMINI_API_KEY not configured, using fallback responses');
            return res.status(200).json({ reply: getFallbackReply(message) });
        }

        try {
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

            const systemPrompt = 'You are a helpful AI assistant for a car servicing and ride-booking company named QuickFixRide. Be polite, keep answers concise (under 200 words), and only answer questions related to automotive services, ride booking, and vehicle maintenance. If asked about unrelated topics, politely redirect. User says: ';

            // Add timeout to prevent hanging
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('AI request timed out')), 15000)
            );

            const resultPromise = model.generateContent(systemPrompt + message);
            const result = await Promise.race([resultPromise, timeoutPromise]);
            const botReply = result.response.text() || "I couldn't process that.";

            res.status(200).json({ reply: botReply });
        } catch (apiError) {
            console.error('Gemini API Error:', apiError.message);
            // Return fallback with a clear indication that AI is unavailable
            res.status(200).json({
                reply: getFallbackReply(message),
                aiAvailable: false
            });
        }
    } catch (error) {
        next(error);
    }
};

function getFallbackReply(message) {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('hello') || /\bhi\b/.test(lowerMessage)) {
        return 'Hello! How can I help you with your car care today?';
    } else if (lowerMessage.includes('book')) {
        return 'You can book a ride or servicing from the Services menu at the top!';
    } else if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
        return 'Our pricing varies by service. Rides start at $2 base fare + $1.50/km, mechanic callouts are $50, and car wash starts at $20.';
    } else if (lowerMessage.includes('wash')) {
        return 'We offer three car wash packages: Basic ($20), Premium ($40), and Full Detailing ($80).';
    }
    return 'I am an automated assistant. The AI service is currently unavailable, but I can help with basic questions! You can book a ride, mechanic, or car wash from the Services menu.';
}
