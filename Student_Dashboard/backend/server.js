// const dns= require('node:dns/promises');
// dns.setServers(['1.1.1.1','8.8.8.8']);

// import cors from 'cors';
// import dotenv from 'dotenv';
// import express from 'express';
// import helmet from 'helmet';
// import rateLimit from 'express-rate-limit';
// import morgan from 'morgan';
// import connectDB from './config/db.js';
// import { errorHandler, notFound } from './middleware/errorMiddleware.js';
// import authRoutes from './routes/authRoutes.js';
// import statsRoutes from './routes/statsRoutes.js';
// import studentRoutes from './routes/studentRoutes.js';
// import taskRoutes from './routes/taskRoutes.js';
// import seedAdmin from './utils/seedAdmin.js';

// dotenv.config();

// const app = express();
// const port = process.env.PORT || 5000;

// await connectDB();
// await seedAdmin();

// app.use(helmet());
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || 'http://localhost:5173',
//     credentials: true
//   })
// );
// app.use(express.json({ limit: '1mb' }));
// app.use(morgan('dev'));
// app.use(
//   rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 300,
//     standardHeaders: true,
//     legacyHeaders: false
//   })
// );

// app.get('/api/health', (req, res) => {
//   res.json({ status: 'ok', service: 'student-dashboard-api' });
// });

// app.use('/api/auth', authRoutes);
// app.use('/api/students', studentRoutes);
// app.use('/api/tasks', taskRoutes);
// app.use('/api/stats', statsRoutes);
// app.use(notFound);
// app.use(errorHandler);

// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });





// server.js

import dns from 'node:dns/promises';
dns.setServers(['1.1.1.1', '8.8.8.8']);

import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import seedAdmin from './utils/seedAdmin.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Seed default admin user
    await seedAdmin();

    // Security middleware
    app.use(helmet());

    // CORS setup
    app.use(
      cors({
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true
      })
    );

    // JSON parsing
    app.use(express.json({ limit: '1mb' }));

    // Logging
    app.use(morgan('dev'));

    // Rate limiting
    app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 300,                 // limit each IP to 300 requests per windowMs
        standardHeaders: true,
        legacyHeaders: false
      })
    );

    // Health check route
    app.get('/api/health', (req, res) => {
      res.json({ status: 'ok', service: 'student-dashboard-api' });
    });

    // API routes
    app.use('/api/auth', authRoutes);
    app.use('/api/students', studentRoutes);
    app.use('/api/tasks', taskRoutes);
    app.use('/api/stats', statsRoutes);

    // Error handling middleware
    app.use(notFound);
    app.use(errorHandler);

    // Start server
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Startup error:', err);
    process.exit(1);
  }
};

startServer();

