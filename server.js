const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to MongoDB & Auto-Seed
connectDB().then(async () => {
  try {
    const User = require('./models/User');
    const Expo = require('./models/Expo');

    // Seed Admin
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      await User.create({
        username: 'admin',
        password: 'admin123',
        role: 'Admin',
        displayName: 'Administrator',
      });
      console.log('✅ Auto-seeded Admin user (admin / admin123)');
    }

    // Seed default User
    const userExists = await User.findOne({ username: 'user' });
    if (!userExists) {
      await User.create({
        username: 'user',
        password: 'user123',
        role: 'User',
        displayName: 'Expo Staff',
      });
      console.log('✅ Auto-seeded Default user (user / user123)');
    }

    // Seed default Expo
    const expoExists = await Expo.findOne({ name: 'Printo Expo Management 2026' });
    if (!expoExists) {
      await Expo.create({ name: 'Printo Expo Management 2026' });
      console.log('✅ Auto-seeded Default expo (Printo Expo 2026)');
    }
  } catch (err) {
    console.error('❌ Auto-seeding error:', err);
  }
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/visitors', require('./routes/visitors'));
app.use('/api/users', require('./routes/users'));
app.use('/api/expos', require('./routes/expos'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root path handler
app.get('/', (req, res) => {
  res.json({ message: 'Printo Expo Management API is running. Access endpoints via /api.' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`   http://localhost:${PORT}/api/health\n`);
});
