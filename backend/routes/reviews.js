const express = require('express');
const Review = require('../models/Review');
const Product = require('../models/Product');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/reviews/product/:productId
// @desc    Get reviews for a product
// @access  Public
router.get('/product/:productId', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = req.query;
    
    const sortObj = {};
    sortObj[sort] = order === 'desc' ? -1 : 1;

    const reviews = await Review.find({ 
      product: req.params.productId,
      isApproved: true 
    })
    .populate('user', 'name avatar')
    .sort(sortObj)
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await Review.countDocuments({ 
      product: req.params.productId,
      isApproved: true 
    });

    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xatosi' });
  }
});

// @route   POST /api/reviews
// @desc    Create a review
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Mahsulot topilmadi' });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product: productId,
      user: req.user._id
    });

    if (existingReview) {
      return res.status(400).json({ message: 'Siz bu mahsulotga allaqachon sharh qoldirgan' });
    }

    // Create review
    const review = new Review({
      product: productId,
      user: req.user._id,
      rating: Number(rating),
      title,
      comment
    });

    await review.save();

    // Update product rating
    await updateProductRating(productId);

    // Populate user info for response
    await review.populate('user', 'name avatar');

    res.status(201).json({
      message: 'Sharh muvaffaqiyatli qo\'shildi',
      review
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xatosi' });
  }
});

// @route   PUT /api/reviews/:id
// @desc    Update a review
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Sharh topilmadi' });
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Ruxsat berilmagan' });
    }

    const { rating, title, comment } = req.body;

    if (rating) review.rating = Number(rating);
    if (title) review.title = title;
    if (comment) review.comment = comment;

    await review.save();

    // Update product rating
    await updateProductRating(review.product);

    await review.populate('user', 'name avatar');

    res.json({
      message: 'Sharh muvaffaqiyatli yangilandi',
      review
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xatosi' });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Sharh topilmadi' });
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Ruxsat berilmagan' });
    }

    const productId = review.product;
    await Review.findByIdAndDelete(req.params.id);

    // Update product rating
    await updateProductRating(productId);

    res.json({ message: 'Sharh muvaffaqiyatli o\'chirildi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xatosi' });
  }
});

// @route   POST /api/reviews/:id/helpful
// @desc    Mark review as helpful
// @access  Private
router.post('/:id/helpful', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Sharh topilmadi' });
    }

    // Check if user already marked as helpful
    const alreadyMarked = review.helpful.users.includes(req.user._id);

    if (alreadyMarked) {
      // Remove from helpful
      review.helpful.users = review.helpful.users.filter(
        userId => userId.toString() !== req.user._id.toString()
      );
      review.helpful.count = Math.max(0, review.helpful.count - 1);
    } else {
      // Add to helpful
      review.helpful.users.push(req.user._id);
      review.helpful.count += 1;
    }

    await review.save();

    res.json({
      message: alreadyMarked ? 'Foydali belgisi olib tashlandi' : 'Foydali deb belgilandi',
      helpful: review.helpful
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xatosi' });
  }
});

// Helper function to update product rating
async function updateProductRating(productId) {
  try {
    const reviews = await Review.find({ 
      product: productId, 
      isApproved: true 
    });

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0;

    await Product.findByIdAndUpdate(productId, {
      'rating.average': Math.round(averageRating * 10) / 10, // Round to 1 decimal
      'rating.count': totalReviews
    });
  } catch (error) {
    console.error('Error updating product rating:', error);
  }
}

module.exports = router;