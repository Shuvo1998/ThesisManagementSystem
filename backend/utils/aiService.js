// backend/utils/aiService.js
const axios = require('axios'); // HTTP রিকোয়েস্ট করার জন্য axios লাগবে

// Python Microservice এর বেস URL, আপনার পোর্ট 5001 এ চলছে
// যদি Python সার্ভিস অন্য মেশিনে চলে, তাহলে 'localhost' এর বদলে সেই IP ব্যবহার করুন
const AI_SERVICE_BASE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5001';

/**
 * একটি টেক্সটের জন্য সেমান্টিক এমবেডিং পেতে Python AI সার্ভিসকে কল করে।
 * @param {string} text - যে টেক্সটের এমবেডিং তৈরি করতে হবে।
 * @returns {Promise<number[]|null>} - এমবেডিং ভেক্টর অথবা null যদি কোনো এরর হয়।
 */
async function getEmbeddingForText(text) {
    try {
        const response = await axios.post(`${AI_SERVICE_BASE_URL}/embed`, { text });
        if (response.status === 200 && response.data && response.data.embedding) {
            return response.data.embedding;
        }
        console.error('Error: Unexpected response from AI service for embedding:', response.data);
        return null;
    } catch (error) {
        console.error('Error calling AI service for embedding:', error.message);
        if (error.response) {
            console.error('AI service error details:', error.response.data);
        }
        return null;
    }
}

/**
 * সেমান্টিক সার্চ করার জন্য Python AI সার্ভিসকে কল করে।
 * @param {string} queryText - যে টেক্সট দিয়ে সার্চ করা হবে।
 * @param {number[][]} thesisEmbeddings - ডেটাবেজ থেকে আনা থিসিসগুলোর এমবেডিং ভেক্টরের তালিকা।
 * @returns {Promise<number[]|null>} - সিমিলারিটি স্কোরের তালিকা অথবা null যদি কোনো এরর হয়।
 */
async function getSemanticSimilarities(queryText, thesisEmbeddings) {
    try {
        const response = await axios.post(`${AI_SERVICE_BASE_URL}/semantic-search`, {
            query_text: queryText,
            thesis_embeddings: thesisEmbeddings
        });
        if (response.status === 200 && response.data && response.data.similarities) {
            return response.data.similarities;
        }
        console.error('Error: Unexpected response from AI service for semantic search:', response.data);
        return null;
    } catch (error) {
        console.error('Error calling AI service for semantic search:', error.message);
        if (error.response) {
            console.error('AI service error details:', error.response.data);
        }
        return null;
    }
}

module.exports = {
    getEmbeddingForText,
    getSemanticSimilarities
};