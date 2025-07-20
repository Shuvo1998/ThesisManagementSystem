// backend/utils/embeddingService.js
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// টেক্সট থেকে এম্বেডিং জেনারেট করার ফাংশন
async function generateEmbedding(text) {
    try {
        const response = await openai.embeddings.create({
            model: "text-embedding-ada-002", // OpenAI এর এম্বেডিং মডেল
            input: text,
        });
        return response.data[0].embedding; // এম্বেডিং ভেক্টরটি ফেরত দেবে
    } catch (error) {
        console.error('Error generating embedding:', error);
        throw new Error('Failed to generate embedding for text.');
    }
}

// দুটি এম্বেডিং এর মধ্যে কোসাইন সিমিলারিটি গণনা করার ফাংশন
// এটি সিমেন্টিক সার্চে প্রাসঙ্গিকতা নির্ণয় করতে ব্যবহৃত হবে
function calculateCosineSimilarity(vecA, vecB) {
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        magnitudeA += vecA[i] * vecA[i];
        magnitudeB += vecB[i] * vecB[i];
    }

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    if (magnitudeA === 0 || magnitudeB === 0) {
        return 0; // যদি কোনো ভেক্টর জিরো হয়, সিমিলারিটি জিরো
    }

    return dotProduct / (magnitudeA * magnitudeB);
}

module.exports = {
    generateEmbedding,
    calculateCosineSimilarity
};