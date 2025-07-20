// backend/controllers/thesisController.js
const Thesis = require('../models/Thesis');
const { getEmbeddingForText, getSemanticSimilarities } = require('../utils/aiService');

// --- নতুন বা বিদ্যমান ফাংশন যা ড্যাশবোর্ডের জন্য প্রয়োজন ---

// @desc    সমস্ত অনুমোদিত থিসিস পান
// @route   GET /api/theses
// @access  Public
exports.getAllTheses = async (req, res) => {
    try {
        // শুধুমাত্র 'approved' স্ট্যাটাসের থিসিসগুলো দেখাবে
        // .populate('user', 'email username') দিয়ে কোন ইউজার আপলোড করেছে, তার তথ্যও আনা যাবে
        const theses = await Thesis.find({ status: 'approved' }).populate('user', 'email username');
        res.json(theses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    লগইন করা ইউজারের আপলোড করা থিসিসগুলো পান
// @route   GET /api/theses/me
// @access  Private
exports.getMyTheses = async (req, res) => {
    try {
        // req.user.id auth মিডলওয়্যার থেকে আসে
        const theses = await Thesis.find({ user: req.user.id });
        res.json(theses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// --- আপনার বিদ্যমান আপলোড এবং আপডেট ফাংশন ---

// নতুন থিসিস আপলোডের জন্য
exports.uploadThesis = async (req, res) => {
    try {
        const { title, abstract, author, supervisor, department, university, publicationYear } = req.body;
        const pdfPath = req.file.path; // Multer বা অনুরূপ কিছু থেকে ফাইল পাথ

        // অ্যাবস্ট্রাক্ট এবং টাইটেল থেকে এমবেডিং তৈরি
        const combinedText = `${title}. ${abstract}`; // টাইটেল এবং অ্যাবস্ট্রাক্ট একত্রিত করি
        const embedding = await getEmbeddingForText(combinedText);

        const newThesis = new Thesis({
            title,
            abstract,
            author,
            supervisor,
            department,
            university,
            publicationYear,
            pdfPath,
            status: 'pending',
            user: req.user.id, // থিসিসটি কোন ইউজার আপলোড করেছে তার আইডি
            embedding: embedding // এমবেডিং এখানে যোগ করা হলো
        });

        const savedThesis = await newThesis.save();
        res.status(201).json(savedThesis);
    } catch (error) {
        console.error('Error uploading thesis:', error);
        res.status(500).json({ message: 'Error uploading thesis', error: error.message });
    }
};

// থিসিস আপডেট করার জন্য (যদি অ্যাবস্ট্রাক্ট বা টাইটেল আপডেট হয়)
exports.updateThesis = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Ensure user is authorized to update (optional, but good practice)
        let thesis = await Thesis.findById(id);
        if (!thesis) {
            return res.status(404).json({ message: 'Thesis not found' });
        }
        if (thesis.user.toString() !== req.user.id && req.user.role !== 'admin') { // Assuming req.user is from auth middleware
            return res.status(403).json({ message: 'Not authorized to update this thesis' });
        }

        // যদি টাইটেল বা অ্যাবস্ট্রাক্ট আপডেট হয়, নতুন এমবেডিং তৈরি করতে হবে
        if (updates.title || updates.abstract) {
            const updatedTitle = updates.title || thesis.title;
            const updatedAbstract = updates.abstract || thesis.abstract;
            const combinedText = `${updatedTitle}. ${updatedAbstract}`;
            updates.embedding = await getEmbeddingForText(combinedText);
        }

        const updatedThesis = await Thesis.findByIdAndUpdate(id, updates, { new: true });
        // updatedThesis যদি না পাওয়া যায়, তাহলে এরর হ্যান্ডেল করা উচিত, যদিও আমরা উপরে thesis চেক করেছি।
        res.status(200).json(updatedThesis);
    } catch (error) {
        console.error('Error updating thesis:', error);
        res.status(500).json({ message: 'Error updating thesis', error: error.message });
    }
};

// সেমান্টিক সার্চের জন্য নতুন এন্ডপয়েন্ট
exports.semanticSearchTheses = async (req, res) => {
    try {
        const { query } = req.query; // ফ্রন্টএন্ড থেকে সার্চ কোয়েরি আসবে
        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        // সমস্ত অ্যাপ্রুভড থিসিস এবং তাদের এমবেডিংগুলো ডেটাবেজ থেকে নিয়ে আসি
        // শুধুমাত্র "approved" স্ট্যাটাসের থিসিসগুলো সার্চে দেখাবো
        const allApprovedTheses = await Thesis.find({ status: 'approved', embedding: { $exists: true, $ne: null } })
                                            .select('_id title abstract author embedding');

        if (allApprovedTheses.length === 0) {
            return res.status(200).json([]); // কোনো থিসিস না থাকলে খালি অ্যারে ফেরত
        }

        const thesisEmbeddings = allApprovedTheses.map(thesis => thesis.embedding);
        // Note: You had thesisIds here, but it's not used in the similarity calculation with the AI service
        // const thesisIds = allApprovedTheses.map(thesis => thesis._id.toString());

        // Python AI সার্ভিসকে কল করে সিমিলারিটি স্কোরগুলো পাই
        const similarities = await getSemanticSimilarities(query, thesisEmbeddings);

        if (!similarities) {
            return res.status(500).json({ message: 'Failed to get semantic similarities from AI service.' });
        }

        // থিসিসগুলোকে তাদের সিমিলারিটি স্কোরের ভিত্তিতে সাজাই
        const rankedTheses = allApprovedTheses.map((thesis, index) => ({
            ...thesis._doc, // MongoDB ডকুমেন্টকে সাধারণ জাভাস্ক্রিপ্ট অবজেক্টে রূপান্তর
            similarityScore: similarities[index]
        }))
        .sort((a, b) => b.similarityScore - a.similarityScore) // ডিসেন্ডিং অর্ডারে সাজানো
        .filter(thesis => thesis.similarityScore > 0.5); // একটি থ্রেশহোল্ড সেট করা, যেমন 0.5 এর বেশি

        res.status(200).json(rankedTheses);

    } catch (error) {
        console.error('Error during semantic search:', error);
        res.status(500).json({ message: 'Error performing semantic search', error: error.message });
    }
};