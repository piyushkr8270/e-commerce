const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxlength: [1000, 'Product description cannot exceed 1000 characters']
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price must be greater than or equal to 0'],
      default: 0.0
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price must be greater than or equal to 0']
    },
    discountPercentage: {
      type: Number,
      min: [0, 'Discount percentage cannot be less than 0'],
      max: [100, 'Discount percentage cannot exceed 100']
    },
    offerLabel: {
      type: String,
      trim: true
    },
    onOffer: {
      type: Boolean,
      default: false
    },
    images: {
      type: [String],
      default: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600']
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true
    },
    subCategory: {
      type: String,
      trim: true
    },
    stock: {
      type: Number,
      required: [true, 'Product stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    ratings: {
      type: Number,
      default: 0,
      min: [0, 'Ratings cannot be less than 0'],
      max: [5, 'Ratings cannot be more than 5']
    },
    numReviews: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Indexes to speed up queries and allow text search
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
