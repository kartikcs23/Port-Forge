const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function makeAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find the first user and make them admin
    const user = await User.findOne().sort({ createdAt: 1 });

    if (!user) {
      console.log('No users found in database');
      return;
    }

    user.role = 'admin';
    await user.save();

    console.log(`✅ Made user "${user.name}" (${user.email}) an admin`);
    console.log('Admin dashboard is now accessible at /admin');

  } catch (error) {
    console.error('Error making user admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
makeAdmin();