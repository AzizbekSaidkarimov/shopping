const express = require('express');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const Review = require('../models/Review');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Basic counts
    const [totalProducts, totalUsers, totalOrders, totalReviews] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'user' }),
      Order.countDocuments(),
      Review.countDocuments({ isApproved: true })
    ]);

    // Revenue analytics
    const [dailyRevenue, weeklyRevenue, monthlyRevenue, yearlyRevenue] = await Promise.all([
      getRevenue(startOfDay),
      getRevenue(startOfWeek),
      getRevenue(startOfMonth),
      getRevenue(startOfYear)
    ]);

    // Order analytics
    const [dailyOrders, weeklyOrders, monthlyOrders, yearlyOrders] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: startOfDay } }),
      Order.countDocuments({ createdAt: { $gte: startOfWeek } }),
      Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Order.countDocuments({ createdAt: { $gte: startOfYear } })
    ]);

    // Best selling products
    const bestSellingProducts = await Product.find({ isActive: true })
      .sort({ soldCount: -1 })
      .limit(10)
      .select('name nameUz price soldCount images');

    // Recent orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('orderNumber totalAmount status createdAt user');

    // Low stock products
    const lowStockProducts = await Product.find({ 
      isActive: true,
      totalStock: { $lte: 5, $gt: 0 }
    })
    .select('name nameUz totalStock')
    .limit(10);

    // Out of stock products
    const outOfStockProducts = await Product.countDocuments({ 
      isActive: true,
      totalStock: 0
    });

    res.json({
      overview: {
        totalProducts,
        totalUsers,
        totalOrders,
        totalReviews,
        outOfStockProducts
      },
      revenue: {
        daily: dailyRevenue,
        weekly: weeklyRevenue,
        monthly: monthlyRevenue,
        yearly: yearlyRevenue
      },
      orders: {
        daily: dailyOrders,
        weekly: weeklyOrders,
        monthly: monthlyOrders,
        yearly: yearlyOrders
      },
      bestSellingProducts,
      recentOrders,
      lowStockProducts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xatosi' });
  }
});

// @route   GET /api/admin/analytics/revenue
// @desc    Get revenue analytics
// @access  Private/Admin
router.get('/analytics/revenue', adminAuth, async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    let groupBy;
    let dateFormat;
    
    switch (period) {
      case 'week':
        groupBy = {
          year: { $year: '$createdAt' },
          week: { $week: '$createdAt' }
        };
        dateFormat = 'week';
        break;
      case 'year':
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        };
        dateFormat = 'month';
        break;
      default: // month
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
        dateFormat = 'day';
    }

    const revenueData = await Order.aggregate([
      {
        $match: {
          status: { $in: ['delivered', 'confirmed'] },
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: groupBy,
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    res.json({ revenueData, period, dateFormat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xatosi' });
  }
});

// @route   GET /api/admin/products
// @desc    Get all products for admin (including inactive)
// @access  Private/Admin
router.get('/products', adminAuth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search = '', 
      category = '', 
      status = '' 
    } = req.query;

    const query = {};

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const total = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xatosi' });
  }
});

// @route   GET /api/admin/orders
// @desc    Get all orders for admin
// @access  Private/Admin
router.get('/orders', adminAuth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status = '', 
      search = '' 
    } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.fullName': { $regex: search, $options: 'i' } }
      ];
    }

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('items.product', 'name nameUz')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xatosi' });
  }
});

// @route   PUT /api/admin/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put('/orders/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Buyurtma topilmadi' });
    }

    order.status = status;
    
    if (status === 'delivered') {
      order.deliveredAt = new Date();
      
      // Update product sold count
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { soldCount: item.quantity }
        });
      }
    }

    if (status === 'cancelled') {
      order.cancelledAt = new Date();
    }

    await order.save();

    res.json({
      message: 'Buyurtma holati yangilandi',
      order
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xatosi' });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users for admin
// @access  Private/Admin
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;

    const query = { role: 'user' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xatosi' });
  }
});

// @route   GET /api/admin/reviews
// @desc    Get all reviews for admin
// @access  Private/Admin
router.get('/reviews', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, approved = '' } = req.query;

    const query = {};

    if (approved === 'true') {
      query.isApproved = true;
    } else if (approved === 'false') {
      query.isApproved = false;
    }

    const reviews = await Review.find(query)
      .populate('user', 'name email')
      .populate('product', 'name nameUz')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments(query);

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

// @route   PUT /api/admin/reviews/:id/approve
// @desc    Approve/Disapprove review
// @access  Private/Admin
router.put('/reviews/:id/approve', adminAuth, async (req, res) => {
  try {
    const { approved } = req.body;
    
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Sharh topilmadi' });
    }

    review.isApproved = approved;
    await review.save();

    // Update product rating
    await updateProductRating(review.product);

    res.json({
      message: approved ? 'Sharh tasdiqlandi' : 'Sharh rad etildi',
      review
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xatosi' });
  }
});

// Helper function to get revenue
async function getRevenue(startDate) {
  const result = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        status: { $in: ['delivered', 'confirmed'] },
        paymentStatus: 'paid'
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$totalAmount' }
      }
    }
  ]);

  return result.length > 0 ? result[0].total : 0;
}

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
      'rating.average': Math.round(averageRating * 10) / 10,
      'rating.count': totalReviews
    });
  } catch (error) {
    console.error('Error updating product rating:', error);
  }
}

module.exports = router;