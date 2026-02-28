# MERN Chat Application — TypeScript Prompt

---

## 🧠 Master Prompt

> Use this prompt with any capable AI coding assistant (Claude, ChatGPT, Gemini, Cursor, etc.) to generate a full-stack MERN chat application with TypeScript.

---

## Prompt

```
Build a full-stack real-time chat application using the MERN stack with TypeScript. Follow all instructions below precisely.

---

## 🗂 Project Structure

mern-chat/
├── server/                  # Express + Node.js backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts              # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   └── messageController.ts
│   │   ├── middleware/
│   │   │   └── authMiddleware.ts   # JWT verification
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Message.ts
│   │   │   └── Room.ts
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   └── messageRoutes.ts
│   │   ├── socket/
│   │   │   └── socketHandler.ts   # Socket.io logic
│   │   ├── types/
│   │   │   └── index.ts           # Shared server types
│   │   └── index.ts               # App entry point
│   ├── .env
│   ├── tsconfig.json
│   └── package.json
│
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat/
│   │   │   │   ├── ChatWindow.tsx
│   │   │   │   ├── MessageBubble.tsx
│   │   │   │   ├── MessageInput.tsx
│   │   │   │   └── TypingIndicator.tsx
│   │   │   ├── Sidebar/
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── RoomList.tsx
│   │   │   │   └── OnlineUsers.tsx
│   │   │   └── Auth/
│   │   │       ├── Login.tsx
│   │   │       └── Register.tsx
│   │   ├── context/
│   │   │   ├── AuthContext.tsx
│   │   │   └── SocketContext.tsx
│   │   ├── hooks/
│   │   │   ├── useSocket.ts
│   │   │   ├── useMessages.ts
│   │   │   └── useAuth.ts
│   │   ├── pages/
│   │   │   ├── ChatPage.tsx
│   │   │   └── AuthPage.tsx
│   │   ├── types/
│   │   │   └── index.ts           # Shared client types
│   │   ├── api/
│   │   │   └── axiosClient.ts     # Axios instance with interceptors
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── tsconfig.json
│   └── package.json

---

## ⚙️ Tech Stack

### Backend
- Node.js + Express (TypeScript)
- MongoDB with Mongoose (typed schemas)
- Socket.io v4 (real-time messaging)
- JWT (jsonwebtoken) for authentication
- bcryptjs for password hashing
- dotenv for environment variables
- ts-node-dev for dev server

### Frontend
- React 18 + Vite (TypeScript)
- Socket.io-client v4
- Axios for HTTP requests
- React Router v6
- Tailwind CSS for styling
- Context API for state management

---

## 🗄 Data Models

### User Model (Mongoose + TypeScript)
- _id: ObjectId
- username: string (unique, required)
- email: string (unique, required)
- password: string (hashed)
- avatar: string (url or initials fallback)
- isOnline: boolean (default: false)
- lastSeen: Date
- createdAt: Date

### Message Model
- _id: ObjectId
- sender: ObjectId (ref: User)
- room: ObjectId (ref: Room)
- content: string
- type: 'text' | 'image' | 'file'
- readBy: ObjectId[] (ref: User)
- createdAt: Date

### Room Model
- _id: ObjectId
- name: string
- isGroup: boolean
- members: ObjectId[] (ref: User)
- lastMessage: ObjectId (ref: Message)
- createdAt: Date

---

## 🔌 API Endpoints

### Auth Routes — /api/auth
POST /register     → { username, email, password } → returns { user, token }
POST /login        → { email, password }            → returns { user, token }
GET  /me           → (protected) returns current user

### Message Routes — /api/messages (all protected)
GET  /rooms             → returns all rooms for current user
POST /rooms             → create or get DM room { memberId }
POST /rooms/group       → create group room { name, memberIds[] }
GET  /rooms/:roomId/messages  → paginated messages (limit=30, cursor-based)
POST /rooms/:roomId/messages  → send a message { content, type }
PUT  /messages/:msgId/read    → mark message as read

---

## 🔄 Socket.io Events

### Client → Server
- join_room: { roomId }
- leave_room: { roomId }
- send_message: { roomId, content, type }
- typing_start: { roomId }
- typing_stop: { roomId }
- mark_read: { roomId, messageId }

### Server → Client
- new_message: Message object
- user_typing: { userId, username, roomId }
- user_stopped_typing: { userId, roomId }
- user_online: { userId }
- user_offline: { userId }
- message_read: { messageId, userId }
- error: { message }

---

## 🔐 Authentication Flow

1. User registers or logs in via REST API
2. Server returns a signed JWT (expires in 7d)
3. Client stores JWT in localStorage
4. Axios interceptor attaches JWT as Bearer token on every request
5. Socket.io handshake sends JWT in auth: { token } for socket authentication
6. authMiddleware.ts verifies token and attaches req.user on protected routes
7. socketHandler.ts verifies token on connection and stores socket-to-user mapping

---

## 🧩 Key Implementation Details

### Backend — server/src/index.ts
- Initialize Express app
- Connect to MongoDB
- Setup CORS for frontend origin
- Mount REST routes
- Initialize Socket.io with cors config
- Pass io instance to socketHandler
- Listen on PORT from env

### Backend — socketHandler.ts
- On connection: verify JWT from socket.handshake.auth.token
- Store userId → socketId mapping in a Map<string, string>
- On join_room: socket.join(roomId), emit history
- On send_message: save to DB, emit new_message to room
- On disconnect: set user isOnline=false, emit user_offline to all rooms

### Frontend — SocketContext.tsx
- Create socket instance with auth token on login
- Expose socket via context
- On mount: connect; on unmount/logout: disconnect
- Listen for global events (user_online, user_offline)

### Frontend — useMessages.ts hook
- Manages messages state for a given roomId
- Fetches initial messages from REST API
- Appends new messages from socket events
- Handles optimistic updates when sending
- Tracks typing users

### Frontend — ChatWindow.tsx
- Auto-scrolls to latest message using useRef + useEffect
- Renders MessageBubble components with sender avatar and timestamp
- Shows TypingIndicator when others are typing
- Groups consecutive messages by the same sender

---

## 🎨 UI Requirements

### Layout
- Left sidebar (260px): user profile header, room/DM list, online user count
- Main area: chat header (room name, members), message window, input bar
- Fully responsive — sidebar collapses on mobile

### Styling (Tailwind CSS)
- Dark theme by default: bg-gray-900 for main, bg-gray-800 for sidebar
- Sent messages: right-aligned, bg-indigo-600, rounded-tl-2xl rounded-b-2xl
- Received messages: left-aligned, bg-gray-700, rounded-tr-2xl rounded-b-2xl
- Online indicator: green dot (w-2.5 h-2.5 rounded-full bg-green-400)
- Unread badge: red pill on room list item
- Message input: sticky bottom bar, rounded-full input, send button with icon

### Features to Implement in UI
- Login / Register forms with validation
- Room list with last message preview and timestamp
- Real-time unread message count badge
- Online/offline presence indicators
- Typing indicator (animated dots)
- Message timestamps (relative: "2 min ago")
- User avatars (colored initials as fallback)
- Emoji support in message input
- Scroll-to-bottom button when not at bottom

---

## 📦 Package.json Dependencies

### Server
dependencies: express, mongoose, socket.io, jsonwebtoken, bcryptjs, cors, dotenv
devDependencies: typescript, ts-node-dev, @types/express, @types/node, @types/jsonwebtoken, @types/bcryptjs, @types/cors

### Client
dependencies: react, react-dom, react-router-dom, axios, socket.io-client, date-fns
devDependencies: typescript, vite, @vitejs/plugin-react, @types/react, @types/react-dom, tailwindcss, autoprefixer, postcss

---

## 🌍 Environment Variables

### server/.env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mern-chat
JWT_SECRET=your_super_secret_key_here
CLIENT_URL=http://localhost:5173

### client/.env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000

---

## ✅ TypeScript Requirements

- No use of `any` — all types must be explicitly defined
- Define shared interfaces in each project's types/index.ts:
  IUser, IMessage, IRoom, AuthResponse, SocketEvents
- Mongoose models must use typed interfaces: `Model<IUser>`
- Express Request must be extended to include `req.user: IUser`
- Socket.io must be typed with custom event maps using typed socket interfaces
- All React components must be typed as React.FC<Props> with defined prop interfaces
- All hooks must have explicit return types
- Use enums for message types and socket event names

---

## 🚀 Scripts

### Root package.json (optional monorepo)
"dev": "concurrently \"npm run dev --prefix server\" \"npm run dev --prefix client\""
"install:all": "npm i --prefix server && npm i --prefix client"

---

Now generate the complete application following all specifications above. Start with:
1. server/src/types/index.ts
2. server/src/models/ (all 3 models)
3. server/src/index.ts + config/db.ts
4. server/src/middleware/authMiddleware.ts
5. server/src/controllers/ + routes/
6. server/src/socket/socketHandler.ts
7. client/src/types/index.ts
8. client/src/api/axiosClient.ts
9. client/src/context/ (AuthContext + SocketContext)
10. client/src/hooks/ (useAuth, useMessages, useSocket)
11. client/src/components/ (all components)
12. client/src/pages/ + App.tsx + main.tsx
13. All config files (tsconfig.json, tailwind.config.js, vite.config.ts)

Generate complete, production-ready code for every file. Do not skip or abbreviate any file.
```

---

## 💡 Tips for Best Results

- **In Cursor or Windsurf**: Paste the prompt into a new project chat and let the agent scaffold all files automatically.
- **In ChatGPT / Claude**: Ask for one section at a time (e.g., "Generate the server models section") if the output gets cut off.
- **File by file**: If generating manually, follow the numbered order above — types first, then models, then controllers, then frontend.
- **After generation**: Run `npm install` in both `/server` and `/client`, then start MongoDB locally or use a MongoDB Atlas connection string.

---

## 🧪 Quick Start After Generation

```bash
# Install dependencies
cd server && npm install
cd ../client && npm install

# Start MongoDB (if local)
mongod

# Run both servers
cd server && npm run dev     # → http://localhost:5000
cd client && npm run dev     # → http://localhost:5173
```

---

*Generated for use with Claude, ChatGPT, Cursor, or any capable AI coding assistant.*
