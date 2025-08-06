const express = require('express');
const Product = require('../models/Product');
const { auth, adminAuth, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products with pagination and search
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search = '',
      category = '',
      minPrice = 0,
      maxPrice = '',
      sort = 'createdAt',
      order = 'desc',
      featured = ''
    } = req.query;

    // Build query
    const query = { isActive: true };

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Price filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Featured filter
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'desc' ? -1 : 1;

    // Execute query with pagination
    const products = await Product.find(query)
      .sort(sortObj)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total,
      hasMore: page * limit < total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xatosi' });
  }
});

// @route   GET /api/products/categories
// @desc    Get product categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category', { isActive: true });
    res.json({ categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xatosi' });
  }
});

// @route   GET /api/products/featured
// @desc    Get featured products
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ 
      isActive: true, 
      isFeatured: true 
    })
    .limit(8)
    .sort({ createdAt: -1 })
    .select('-__v');

    res.json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xatosi' });
  }
});

// @route   GET /api/products/bestsellers
// @desc    Get best selling products
// @access  Public
router.get('/bestsellers', async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .sort({ soldCount: -1 })
      .limit(8)
      .select('-__v');

    res.json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xatosi' });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select('-__v');
    
    if (!product) {
      return res.status(404).json({ message: 'Mahsulot topilmadi' });
    }

    if (!product.isActive) {
      return res.status(404).json({ message: 'Mahsulot mavjud emas' });
    }

    res.json({ product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xatosi' });
  }
});

// @route   POST /api/products
// @desc    Create product (Admin only)
// @access  Private/Admin
router.post('/', adminAuth, upload.array('images', 5), async (req, res) => {
  try {
    const {
      name,
      nameUz,
      description,
      descriptionUz,
      price,
      originalPrice,
      category,
      subcategory,
      brand,
      sizes,
      colors,
      tags,
      isFeatured,
      specifications
    } = req.body;

    // Process uploaded images
    const images = req.files ? req.files.map(file => ({
      url: `/uploads/${file.filename}`,
      alt: name
    })) : [];

    // Parse JSON fields if they're strings
    const parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
    const parsedColors = typeof colors === 'string' ? JSON.parse(colors) : colors;
    const parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
    const parsedSpecs = typeof specifications === 'string' ? JSON.parse(specifications) : specifications;

    const product = new Product({
      name,
      nameUz,
      description,
      descriptionUz,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      category,
      subcategory,
      brand,
      sizes: parsedSizes,
      colors: parsedColors,
      images,
      tags: parsedTags,
      isFeatured: isFeatured === 'true',
      specifications: parsedSpecs
    });

    await product.save();

    res.status(201).json({
      message: 'Mahsulot muvaffaqiyatli yaratildi',
      product
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xatosi' });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product (Admin only)
// @access  Private/Admin
router.put('/:id', adminAuth, upload.array('images', 5), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Mahsulot topilmadi' });
    }

    const {
      name,
      nameUz,
      description,
      descriptionUz,
      price,
      originalPrice,
      category,
      subcategory,
      brand,
      sizes,
      colors,
      tags,
      isFeatured,
      isActive,
      specifications
    } = req.body;

    // Update fields
    if (name) product.name = name;
    if (nameUz) product.nameUz = nameUz;
    if (description) product.description = description;
    if (descriptionUz) product.descriptionUz = descriptionUz;
    if (price) product.price = Number(price);
    if (originalPrice !== undefined) product.originalPrice = originalPrice ? Number(originalPrice) : undefined;
    if (category) product.category = category;
    if (subcategory) product.subcategory = subcategory;
    if (brand) product.brand = brand;
    if (sizes) product.sizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
    if (colors) product.colors = typeof colors === 'string' ? JSON.parse(colors) : colors;
    if (tags) product.tags = typeof tags === 'string' ? JSON.parse(tags) : tags;
    if (isFeatured !== undefined) product.isFeatured = isFeatured === 'true';
    if (isActive !== undefined) product.isActive = isActive === 'true';
    if (specifications) product.specifications = typeof specifications === 'string' ? JSON.parse(specifications) : specifications;

    // Add new images if uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        url: `/uploads/${file.filename}`,
        alt: product.name
      }));
      product.images = [...product.images, ...newImages];
    }

    await product.save();

    res.json({
      message: 'Mahsulot muvaffaqiyatli yangilandi',
      product
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xatosi' });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product (Admin only)
// @access  Private/Admin
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Mahsulot topilmadi' });
    }

    // Soft delete - just set isActive to false
    product.isActive = false;
    await product.save();

    res.json({ message: 'Mahsulot muvaffaqiyatli o\'chirildi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xatosi' });
  }
});

// @route   DELETE /api/products/:id/image/:imageIndex
// @desc    Remove product image (Admin only)
// @access  Private/Admin
router.delete('/:id/image/:imageIndex', adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Mahsulot topilmadi' });
    }

    const imageIndex = parseInt(req.params.imageIndex);
    
    if (imageIndex < 0 || imageIndex >= product.images.length) {
      return res.status(400).json({ message: 'Noto\'g\'ri rasm indeksi' });
    }

    product.images.splice(imageIndex, 1);
    await product.save();

    res.json({ message: 'Rasm muvaffaqiyatli o\'chirildi', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xatosi' });
  }
});

module.exports = router;