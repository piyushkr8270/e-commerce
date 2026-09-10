require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

// Initialize database connection
connectDB();

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors());

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use('/api', apiLimiter);

// Health Check API
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Route Mounts
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

// Static Hero Assets Serve & Sync
const fs = require('fs');
const path = require('path');
const artifactDir = 'C:\\Users\\HP\\.gemini\\antigravity-ide\\brain\\c862ab86-7d72-407b-ad66-2549d9c321ca';
const clientPublicDir = path.join(__dirname, '../client/public');

try {
  if (!fs.existsSync(clientPublicDir)) {
    fs.mkdirSync(clientPublicDir, { recursive: true });
  }
  const assetMap = [
    { src: 'hero_earbuds_3d_1788986416061.jpg', dest: 'hero-earbuds.jpg' },
    { src: 'hero_smartwatch_3d_1788986435961.jpg', dest: 'hero-smartwatch.jpg' },
    { src: 'hero_headset_3d_1788986451205.jpg', dest: 'hero-headset.jpg' },
    { src: 'neon_backpack_card_1788988622375.jpg', dest: 'backpack-neon.jpg' }
  ];
  assetMap.forEach(({ src, dest }) => {
    const srcPath = path.join(artifactDir, src);
    const destPath = path.join(clientPublicDir, dest);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Synced asset: ${dest}`);
    }
  });

  // Automatically update the database document for Premium Leather Backpack
  const ProductModel = require('./models/Product');
  ProductModel.updateMany(
    { name: "Premium Leather Backpack" },
    { $set: { images: ["/backpack-neon.jpg"] } }
  ).then((res) => {
    if (res.modifiedCount > 0) {
      console.log(`Updated Premium Leather Backpack image in DB: ${res.modifiedCount} modified`);
    }
  }).catch((err) => console.error('DB update error:', err.message));

  const https = require('https');
  const backpackOrigPath = path.join(artifactDir, 'original_backpack.jpg');
  if (!fs.existsSync(backpackOrigPath)) {
    const file = fs.createWriteStream(backpackOrigPath);
    https.get('https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800', (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('Original backpack image downloaded successfully');
      });
    }).on('error', (err) => {
      fs.unlink(backpackOrigPath, () => {});
      console.error('Error downloading backpack image:', err.message);
    });
  }
} catch (e) {
  console.error('Error syncing hero assets:', e.message);
}

app.use('/api/hero-assets', express.static(clientPublicDir));

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
