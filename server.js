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

    // Remove old default user & default expo if they exist
    const userDeleted = await User.deleteOne({ username: 'user' });
    if (userDeleted.deletedCount > 0) {
      console.log('🗑️ Removed default user (user) from database');
    }
    const expoDeleted = await Expo.deleteOne({ name: 'Printo Expo Management 2026' });
    if (expoDeleted.deletedCount > 0) {
      console.log('🗑️ Removed default expo (Printo Expo Management 2026) from database');
    }
  } catch (err) {
    console.error('❌ Auto-seeding/cleanup error:', err);
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
