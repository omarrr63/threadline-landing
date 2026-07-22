# Threadline Backend - WhatsApp Business SaaS

A comprehensive Node.js/Express backend for a WhatsApp Business SaaS platform with team collaboration, AI chatbot, and integrations.

## Features

✅ **Official WhatsApp Business API Integration**
✅ **Send Bulk Messages** with templates
✅ **Unlimited Chatbot Sessions** powered by OpenAI
✅ **Shared Team Inbox** with real-time updates
✅ **Hide Customer's Number** (Phone masking)
✅ **AI Agent for WhatsApp** conversations
✅ **API & Webhook Integration** for custom systems
✅ **Google Sheets, Zapier & Make** integration
✅ **7-Days Support Available**
✅ **Free Migration** from other BSPs
✅ **Subscription Plans** (Free, Starter, Professional, Enterprise)
✅ **Payment Processing** with Stripe

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Real-time**: Socket.IO
- **AI**: OpenAI GPT-3.5
- **Payments**: Stripe
- **Message Queue**: Bull/Redis
- **Authentication**: JWT

## Installation

```bash
cd backend
npm install
cp .env.example .env
# Update .env with your credentials
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### WhatsApp
- `POST /api/whatsapp/connect` - Connect WhatsApp Business Account
- `POST /api/whatsapp/send-message` - Send single message
- `POST /api/whatsapp/send-bulk` - Send bulk messages
- `POST /api/whatsapp/webhook` - Receive incoming messages

### Messages & Conversations
- `GET /api/messages/conversations` - Get all conversations
- `GET /api/messages/conversation/:id` - Get conversation messages
- `PATCH /api/messages/:id/read` - Mark as read

### Team
- `GET /api/team/members` - Get team members
- `POST /api/team/members` - Add team member
- `DELETE /api/team/members/:id` - Remove team member

### Chatbot
- `POST /api/chatbot/flows` - Create chatbot flow
- `GET /api/chatbot/flows` - Get chatbot flows
- `POST /api/chatbot/ai-response` - Get AI response

### Integrations
- `POST /api/integrations/google-sheets` - Connect Google Sheets
- `POST /api/integrations/zapier` - Connect Zapier
- `POST /api/integrations/make` - Connect Make

### Billing
- `POST /api/billing/subscribe` - Create subscription
- `GET /api/billing/plan` - Get current plan

### Analytics
- `GET /api/analytics/stats` - Get dashboard stats
- `GET /api/analytics/messages` - Get message analytics

## Environment Variables

See `.env.example` for all required environment variables.

## Project Structure

```
backend/
├── models/           # Database schemas
├── routes/           # API endpoints
├── middleware/       # Express middleware
├── scripts/          # Utility scripts
├── server.js         # Main server file
├── package.json      # Dependencies
└── README.md         # This file
```

## Testing

```bash
npm test
```

## Deployment

```bash
NODE_ENV=production npm start
```

## Support

For support, reach out to support@threadline.io

## License

MIT
