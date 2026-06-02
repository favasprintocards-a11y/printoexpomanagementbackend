const express = require('express');
const router = express.Router();
const Expo = require('../models/Expo');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/expos
// @desc    Get all expos
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const expos = await Expo.find().sort({ name: 1 });
    res.json(expos);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/expos
// @desc    Create a new expo (Admin only)
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Expo name is required' });
    }

    const exists = await Expo.findOne({ name: name.trim() });
    if (exists) {
      return res.status(400).json({ message: 'Expo name already exists' });
    }

    const expo = await Expo.create({ name: name.trim() });
    res.status(201).json(expo);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/expos/:id
// @desc    Delete an expo (Admin only)
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const expo = await Expo.findById(req.params.id);

    if (!expo) {
      return res.status(404).json({ message: 'Expo not found' });
    }

    await expo.deleteOne();
    res.json({ message: 'Expo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
