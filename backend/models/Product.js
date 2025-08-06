const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  nameUz: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  descriptionUz: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['kiyim', 'poyabzal', 'aksessuar'], // clothes, shoes, accessories in Uzbek
    trim: true
  },
  subcategory: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  sizes: [{
    size: String,
    stock: {
      type: Number,
      default: 0,
      min: 0
    }
  }],
  colors: [String],
  images: [{
    url: String,
    alt: String
  }],
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  totalStock: {
    type: Number,
    default: 0,
    min: 0
  },
  soldCount: {
    type: Number,
    default: 0,
    min: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  specifications: {
    material: String,
    weight: String,
    dimensions: String,
    careInstructions: String
  }
}, {
  timestamps: true
});

// Index for search functionality
productSchema.index({
  name: 'text',
  nameUz: 'text',
  description: 'text',
  descriptionUz: 'text',
  tags: 'text'
});

// Calculate total stock from sizes
productSchema.pre('save', function(next) {
  if (this.sizes && this.sizes.length > 0) {
    this.totalStock = this.sizes.reduce((total, sizeObj) => total + sizeObj.stock, 0);
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);