const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const User = require('./models/User');
const Expo = require('./models/Expo');

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected for seeding');

    // Check if admin already exists
    const adminExists = await User.findOne({ username: 'admin' });
    if (adminExists) {
      console.log('ℹ️  Admin user already exists, skipping...');
    } else {
      await User.create({
        username: 'admin',
        password: 'admin123',
        role: 'Admin',
        displayName: 'Administrator',
      });
      console.log('✅ Admin user created (admin / admin123)');
    }

    // Check if default user exists
    const userExists = await User.findOne({ username: 'user' });
    if (userExists) {
      console.log('ℹ️  Default user already exists, skipping...');
    } else {
      await User.create({
        username: 'user',
        password: 'user123',
        role: 'User',
        displayName: 'Expo Staff',
      });
      console.log('✅ Default user created (user / user123)');
    }

    // Check if default expo exists
    const expoExists = await Expo.findOne({ name: 'Printo Expo Management 2026' });
    if (expoExists) {
      console.log('ℹ️  Default expo already exists, skipping...');
    } else {
      await Expo.create({ name: 'Printo Expo Management 2026' });
      console.log('✅ Default expo created (Printo Expo 2026)');
    }

    console.log('\n🎉 Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.stack || error);
    process.exit(1);
  }
};

seedUsers();
