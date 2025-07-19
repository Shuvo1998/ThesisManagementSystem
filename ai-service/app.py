# ai-service/app.py
from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import os # এটি পোর্ট ম্যানেজ করার জন্য লাগবে

app = Flask(__name__)

# গ্লোবাল ভেরিয়েবল হিসেবে মডেল লোড করি যাতে বারবার লোড না হয়
# এটি সার্ভার চালু হওয়ার সময় একবার লোড হবে
try:
    print("Loading Sentence Transformer model...")
    # 'all-MiniLM-L6-v2' একটি ছোট এবং কার্যকর মডেল। প্রয়োজনে অন্য মডেল ব্যবহার করা যেতে পারে।
    model = SentenceTransformer('all-MiniLM-L6-v2')
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None # মডেল লোড না হলে None সেট করি

@app.route('/embed', methods=['POST'])
def get_embedding():
    if not model:
        return jsonify({"error": "AI model not loaded. Please check server logs."}), 500

    data = request.json
    if not data or 'text' not in data:
        return jsonify({"error": "No 'text' provided in the request body."}), 400

    text_to_embed = data['text']

    try:
        # ইনপুট টেক্সট এর এমবেডিং তৈরি করি
        embedding = model.encode(text_to_embed)
        # NumPy array কে লিস্টে কনভার্ট করি যাতে JSON এ পাঠানো যায়
        return jsonify({"embedding": embedding.tolist()}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to generate embedding: {str(e)}"}), 500

@app.route('/semantic-search', methods=['POST'])
def semantic_search():
    if not model:
        return jsonify({"error": "AI model not loaded. Please check server logs."}), 500

    data = request.json
    if not data or 'query_text' not in data or 'thesis_embeddings' not in data:
        return jsonify({"error": "Missing 'query_text' or 'thesis_embeddings' in request body."}), 400

    query_text = data['query_text']
    thesis_embeddings = np.array(data['thesis_embeddings']) # লিস্টকে NumPy array তে কনভার্ট করি

    try:
        # কোয়েরি টেক্সট এর এমবেডিং তৈরি করি
        query_embedding = model.encode(query_text)
        query_embedding = query_embedding.reshape(1, -1) # reshape করি cosine_similarity এর জন্য

        # থিসিস এমবেডিংগুলোর সাথে কোয়েরি এমবেডিং এর কসইন সিমিলারিটি গণনা করি
        # এখানে thesis_embeddings প্রতিটি থিসিসের একটি এম্বেডিং ভেক্টর হিসেবে আশা করা হচ্ছে
        # অর্থাৎ thesis_embeddings এর shape (num_theses, embedding_dim) হবে
        similarities = cosine_similarity(query_embedding, thesis_embeddings)

        # সিমিলারিটি স্কোরগুলো ফেরত দিই
        # এটি একটি 2D array হবে, তাই প্রথম সারির ডাটা নিই
        return jsonify({"similarities": similarities[0].tolist()}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to perform semantic search: {str(e)}"}), 500

@app.route('/health', methods=['GET'])
def health_check():
    # মডেল লোড হয়েছে কিনা তা চেক করি
    if model:
        return jsonify({"status": "AI service is up and running", "model_loaded": True}), 200
    else:
        return jsonify({"status": "AI service is up but model failed to load", "model_loaded": False}), 500

if __name__ == '__main__':
    # PORT এনভায়রনমেন্ট ভেরিয়েবল থেকে পোর্ট নিই, না পেলে 5001 ব্যবহার করি
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)