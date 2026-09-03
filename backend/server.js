const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const config = require('./src/config');

const aiRoutes = require('./src/routes/ai');
const resumesRoutes = require('./src/routes/resumes');
const portfoliosRoutes = require('./src/routes/portfolios');
const pdfRoutes = require('./src/routes/pdf');
const paymentsRoutes = require('./src/routes/payments');

const app = express();

// Security & Middleware
app.use(cors({
  origin: [config.frontendUrl, 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting for AI routes to prevent abuse
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: { error: 'Too many requests for AI services. Please try again later.' }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    aiConfigured: Boolean(config.geminiApiKey),
    supabaseConfigured: Boolean(config.supabaseUrl)
  });
});

// API Routes
app.use('/api/ai', aiLimiter, aiRoutes);
app.use('/api/resumes', resumesRoutes);
app.use('/api/portfolios', portfoliosRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/payments', paymentsRoutes);

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[Global Backend Error]:', err.stack || err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(config.nodeEnv === 'development' ? { stack: err.stack } : {})
  });
});

// Start Server
app.listen(config.port, () => {
  console.log(`=================================================`);
  console.log(`🚀 AI Resume Backend running on port ${config.port}`);
  console.log(`🤖 AI Provider: Google Gemini (${config.geminiApiKey ? 'API Key Active' : 'Fallback Mode'})`);
  console.log(`⚡ Supabase DB: ${config.supabaseUrl ? 'Connected' : 'Local Fallback Mode'}`);
  console.log(`=================================================`);
});
