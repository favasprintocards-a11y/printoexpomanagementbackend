const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/visitors
// @desc    Get visitors — Admin sees all, User sees own
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = {};

    // Non-admin users can only see their own entries
    if (req.user.role !== 'Admin') {
      query.addedBy = req.user._id;
    }

    const visitors = await Visitor.find(query)
      .populate('addedBy', 'username displayName')
      .sort({ createdAt: 1 });

    res.json(visitors);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/visitors
// @desc    Create a new visitor entry
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { personName, type, companyName, mobile, location, dateTime, expoName } = req.body;

    const visitor = await Visitor.create({
      personName,
      type,
      companyName,
      mobile,
      location,
      dateTime: dateTime || new Date(),
      expoName,
      addedBy: req.user._id,
    });

    // Populate addedBy before returning
    const populated = await Visitor.findById(visitor._id).populate('addedBy', 'username displayName');

    res.status(201).json(populated);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/visitors/batch-delete
// @desc    Delete multiple visitor entries (Admin or Owner)
// @access  Private
router.post('/batch-delete', protect, async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No IDs provided for deletion' });
    }

    const query = { _id: { $in: ids } };
    if (req.user.role !== 'Admin') {
      query.addedBy = req.user._id;
    }

    const result = await Visitor.deleteMany(query);
    res.json({ message: 'Selected visitors deleted successfully', deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/visitors/:id
// @desc    Delete a visitor entry (Admin or Owner)
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }

    // Standard user can only delete their own entries
    if (req.user.role !== 'Admin' && visitor.addedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this record' });
    }

    await visitor.deleteOne();
    res.json({ message: 'Visitor deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
