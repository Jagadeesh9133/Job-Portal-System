const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const jobsRoutes = require('./routes/jobs');
const resumeRoutes = require('./routes/resume');
const matchingRoutes = require('./routes/matching');
const applicationRoutes = require('./routes/applications');
const { seedDatabase } = require('./utils/seeder');

const app = express();
const PORT = process.env.PORT || 5000;
let databaseInitialization;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database Connection Setup
async function initDatabase() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!databaseInitialization) {
    databaseInitialization = (async () => {
      let mongoUri = process.env.MONGODB_URI;

      if (!mongoUri) {
        if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
          throw new Error('MONGODB_URI must be configured in production.');
        }

        console.log('📦 No local MONGODB_URI found. Starting MongoDB Memory Server...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        mongoUri = mongod.getUri();
        console.log('✅ In-Memory MongoDB running at:', mongoUri);
      }

      await mongoose.connect(mongoUri);
      console.log('🌱 Connected to MongoDB successfully.');
      await seedDatabase();
    })().catch((error) => {
      databaseInitialization = undefined;
      throw error;
    });
  }

  return databaseInitialization;
}

app.use('/api', async (req, res, next) => {
  try {
    await initDatabase();
    next();
  } catch (error) {
    console.error('❌ MongoDB Initialization Error:', error);
    res.status(503).json({ message: 'Database is unavailable' });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/applications', applicationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'Job Portal API',
    timestamp: new Date().toISOString(),
  });
});

if (require.main === module) {
  initDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀 Job Portal Backend Server running on http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error('❌ MongoDB Connection Error:', error);
      process.exitCode = 1;
    });
}

module.exports = app;
