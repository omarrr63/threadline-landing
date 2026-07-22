const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const mongoose = require('mongoose');
const http = require('http');
const socketIO = require('socket.io');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const businessRoutes = require('./routes/business');
const whatsappRoutes = require('./routes/whatsapp');
const messageRoutes = require('./routes/messages');
const chatbotRoutes = require('./routes/chatbot');
const teamRoutes = require('./routes/team');
const integrationsRoutes = require('./routes/integrations');
const billingRoutes = require('./routes/billing');
const analyticsRoutes = require('./routes/analytics');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const authenticate = require('./middleware/authenticate');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST']
  }
});

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Logging Middleware
app.use(morgan('combined'));

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// Socket.IO Setup for Real-time Features
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // Team inbox real-time updates
  socket.on('join-inbox', (teamId) => {
    socket.join(`inbox-${teamId}`);
  });
  
  // Message real-time updates
  socket.on('message-sent', (data) => {
    io.to(`inbox-${data.teamId}`).emit('new-message', data);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running ✅', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticate, userRoutes);
app.use('/api/business', authenticate, businessRoutes);
app.use('/api/whatsapp', authenticate, whatsappRoutes);
app.use('/api/messages', authenticate, messageRoutes);
app.use('/api/chatbot', authenticate, chatbotRoutes);
app.use('/api/team', authenticate, teamRoutes);
app.use('/api/integrations', authenticate, integrationsRoutes);
app.use('/api/billing', authenticate, billingRoutes);
app.use('/api/analytics', authenticate, analyticsRoutes);

// WhatsApp Webhook (No auth required)
app.post('/api/whatsapp/webhook', require('./routes/webhookHandler'));
app.get('/api/whatsapp/webhook', require('./routes/webhookHandler'));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error Handler (Must be last)
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`\n🚀 Threadline Backend Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api\n`);
});

module.exports = { app, io };
