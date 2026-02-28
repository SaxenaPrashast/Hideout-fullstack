# MERN Chat Application

A full-stack real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js) using TypeScript.

## Features

- **Real-time messaging** with Socket.io
- **User authentication** with JWT
- **Direct messages** and **group chats**
- **Online/offline presence** indicators
- **Typing indicators**
- **Message read receipts**
- **Responsive dark theme** with Tailwind CSS

## Tech Stack

### Backend
- Node.js + Express (TypeScript)
- MongoDB with Mongoose
- Socket.io v4
- JWT authentication
- bcryptjs for password hashing

### Frontend
- React 18 + Vite (TypeScript)
- Socket.io-client v4
- Axios for HTTP requests
- React Router v6
- Tailwind CSS

## Project Structure

```
mern-chat/
├── server/                  # Express + Node.js backend
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Auth middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── socket/         # Socket.io handlers
│   │   └── types/          # TypeScript types
│   └── package.json
│
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── api/            # Axios client
│   │   ├── components/     # React components
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Page components
│   │   └── types/          # TypeScript types
│   └── package.json
│
└── package.json            # Root package.json
```

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

## Quick Start

### 1. Install Dependencies

```bash
# Install root dependencies (for concurrent running)
npm install

# Install all dependencies (server + client)
npm run install:all
```

Or manually:
```bash
cd server && npm install
cd ../client && npm install
```

### 2. Configure Environment Variables

Server (server/.env):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mern-chat
JWT_SECRET=your_super_secret_key_here
CLIENT_URL=http://localhost:5173
```

Client (client/.env):
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Start MongoDB

If using local MongoDB:
```bash
mongod
```

Or use MongoDB Atlas connection string in MONGO_URI.

### 4. Run the Application

```bash
# Run both server and client concurrently (from root)
npm run dev

# Or run separately:
npm run server  # Server: http://localhost:5000
npm run client  # Client: http://localhost:5173
```

## API Endpoints

### Auth Routes — /api/auth
- `POST /register` — Register new user
- `POST /login` — Login user
- `GET /me` — Get current user (protected)

### Message Routes — /api/messages (protected)
- `GET /users` — Get all users
- `GET /rooms` — Get user's rooms
- `POST /rooms` — Create/get DM room
- `POST /rooms/group` — Create group room
- `GET /rooms/:roomId/messages` — Get room messages
- `POST /rooms/:roomId/messages` — Send message
- `PUT /messages/:msgId/read` — Mark message as read

## Socket.io Events

### Client → Server
- `join_room` — Join a chat room
- `leave_room` — Leave a chat room
- `send_message` — Send a message
- `typing_start` — Start typing indicator
- `typing_stop` — Stop typing indicator
- `mark_read` — Mark message as read

### Server → Client
- `new_message` — New message received
- `user_typing` — User started typing
- `user_stopped_typing` — User stopped typing
- `user_online` — User came online
- `user_offline` — User went offline
- `message_read` — Message was read
- `error` — Error occurred

## License

MIT
