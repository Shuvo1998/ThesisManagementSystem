// backend/config/db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // .env ফাইল থেকে পরিবেশ ভেরিয়েবল লোড করুন

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true, // Mongoose 6.0+ এ এর আর প্রয়োজন নেই
      // useFindAndModify: false // Mongoose 6.0+ এ এর আর প্রয়োজন নেই
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;