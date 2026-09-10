const Product = require('../models/Product');

// @desc    Get all products with filters, search, and pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const query = {};

    // Text Search
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Category Filter
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Price Filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
    }

    // Ratings Filter
    if (req.query.rating) {
      query.ratings = { $gte: parseFloat(req.query.rating) };
    }

    // Offers Filter
    if (req.query.onOffer === 'true') {
      query.onOffer = true;
    }

    // Sorting
    let sortBy = { createdAt: -1 }; // default: newest first
    if (req.query.sort) {
      if (req.query.sort === 'priceAsc') sortBy = { price: 1 };
      else if (req.query.sort === 'priceDesc') sortBy = { price: -1 };
      else if (req.query.sort === 'ratingDesc') sortBy = { ratings: -1 };
    }

    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortBy)
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: products.length,
      page,
      pages: Math.ceil(totalProducts / limit),
      totalProducts,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product details
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product (Admin only helper)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const { name, price, description, images, category, stock } = req.body;
    
    const product = new Product({
      name,
      price,
      description,
      images: images || undefined,
      category,
      stock
    });

    const createdProduct = await product.save();
    res.status(201).json({ success: true, product: createdProduct });
  } catch (error) {
    next(error);
  }
};

// @desc    Seed demo products
// @route   POST /api/products/seed
// @access  Public
const seedProducts = async (req, res, next) => {
  try {
    // Clear out existing if wanted, or just insert
    await Product.deleteMany({});

    const demoProducts = [
      {
        name: "Pro Wireless Noise Cancelling Headphones",
        description: "Experience premium sound and active noise cancellation. With up to 30 hours of battery life, comfort-fit design, and deep bass performance.",
        price: 299.99,
        originalPrice: 399.99,
        discountPercentage: 25,
        offerLabel: "25% OFF + Free Gift Card",
        onOffer: true,
        category: "Electronics",
        stock: 25,
        ratings: 4.8,
        numReviews: 120,
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600"]
      },
      {
        name: "Minimalist Mechanical Keyboard",
        description: "Compact 60% layout mechanical keyboard with hot-swappable tactile blue switches, customizable RGB backlighting, and USB-C connectivity.",
        price: 89.99,
        originalPrice: 119.99,
        discountPercentage: 25,
        offerLabel: "Flash Deal: 25% Off",
        onOffer: true,
        category: "Electronics",
        stock: 50,
        ratings: 4.5,
        numReviews: 85,
        images: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=600"]
      },
      {
        name: "Ergonomic Office Chair",
        description: "Fully adjustable ergonomic desk chair featuring lumbar support, breathable mesh back, 3D armrests, and dynamic tilt lock mechanisms.",
        price: 189.50,
        category: "Furniture",
        stock: 12,
        ratings: 4.2,
        numReviews: 43,
        images: ["https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&q=80&w=600"]
      },
      {
        name: "Smart Fitness Watch",
        description: "Track your health and activities with built-in GPS, heart rate monitor, sleep tracking, and up to 7-day battery life. Water resistant up to 50m.",
        price: 149.99,
        originalPrice: 199.99,
        discountPercentage: 25,
        offerLabel: "Save $50 Instant",
        onOffer: true,
        category: "Electronics",
        stock: 40,
        ratings: 4.6,
        numReviews: 198,
        images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600"]
      },
      {
        name: "Premium Leather Backpack",
        description: "Handcrafted top-grain leather backpack featuring a padded 15-inch laptop compartment, multiple organization pockets, and durable brass hardware.",
        price: 120.00,
        originalPrice: 160.00,
        discountPercentage: 25,
        offerLabel: "25% OFF Code applied",
        onOffer: true,
        category: "Accessories",
        stock: 18,
        ratings: 4.7,
        numReviews: 64,
        images: ["/backpack-neon.jpg"]
      },
      {
        name: "Double-Walled Insulated Flask",
        description: "Keep your drinks ice cold for 24 hours or hot for 12. Made from food-grade stainless steel with a leak-proof straw cap.",
        price: 24.99,
        category: "Accessories",
        stock: 100,
        ratings: 4.9,
        numReviews: 312,
        images: ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=600"]
      },
      {
        name: "Bamboo Desk Organizer Set",
        description: "Sustainable bamboo desktop modular storage. Includes pen cups, phone dock, post-it holder, and small drawer for miscellaneous items.",
        price: 34.99,
        category: "Furniture",
        stock: 35,
        ratings: 4.4,
        numReviews: 50,
        images: ["https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=600"]
      },
      {
        name: "Studio USB Condenser Microphone",
        description: "Professional cardioid recording microphone for podcasting, streaming, and gaming. Features tap-to-mute sensor and gain control dial.",
        price: 79.99,
        category: "Electronics",
        stock: 8,
        ratings: 4.3,
        numReviews: 92,
        images: ["https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=600"]
      }
    ];

    await Product.insertMany(demoProducts);
    res.status(201).json({ success: true, message: 'Products seeded successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  seedProducts
};
