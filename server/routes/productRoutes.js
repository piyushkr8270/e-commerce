const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  seedProducts
} = require('../controllers/productController');

// Main routes for products
router.route('/')
  .get(getProducts)
  .post(createProduct);

// Demo seed route
router.route('/seed')
  .post(seedProducts);

// Individual product route
router.route('/:id')
  .get(getProductById);

module.exports = router;
