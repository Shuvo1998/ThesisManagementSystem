// backend/middleware/upload.js
const multer = require('multer');
const path = require('path');

// সেটআপ স্টোরেজ ইঞ্জিন
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // ফাইলগুলো কোথায় সেভ হবে তা নির্দিষ্ট করুন
        // নিশ্চিত করুন যে 'uploads' ফোল্ডারটি backend ফোল্ডারে আছে
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // ফাইলের নাম কী হবে তা নির্দিষ্ট করুন
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// ফাইল আপলোডের জন্য Multer ইনস্ট্যান্স তৈরি করুন
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 20 }, // 20 MB ফাইল সাইজ লিমিট
    fileFilter: function (req, file, cb) {
        const filetypes = /pdf/; // শুধুমাত্র PDF ফাইল গ্রহণ করুন
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Error: Only PDF files are allowed!'));
    }
});

module.exports = upload;