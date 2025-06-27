# 💬 ChatApp

A real-time private chat application built using **React**, **Node.js**, **Socket.io**, and **MongoDB**, supporting **media sharing** and **blue tick read receipts**.

---

## 🚀 Features

- 🔐 User Authentication (JWT)
- 💬 Private 1-on-1 messaging
- 📁 Media sharing (images/files)
- ✅ Blue tick when message is read
- 🕐 Timestamps for messages
- 📱 Fully responsive UI

---

## 🛠️ Tech Stack

**Frontend:**
- React.js
- Tailwind CSS
- Socket.io-client

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- Socket.io
- Multer (for media upload to local server)

### 💬 Chat Interface with Media Sharing & Blue Ticks
<image-card alt="Chat" src="media/chat-media.png" ></image-card>

## 🔧 Installation & Running the App

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v14.x or later) and **npm** (v6.x or later)
- **Git** (for cloning the repository)
- **MongoDB** (local installation or MongoDB Atlas for cloud)
- A modern web browser (e.g., Chrome, Firefox)

### Installation Steps

Run the following commands in your terminal to set up and start the ChatApp:
# Clone the repository and install dependencies
```bash
git clone https://github.com/SakshamSharma10989/ChatApp.git
cd ChatApp
```

# Start the server (in one terminal)
```bash
cd backend
nodemon server.js
```
# Start the client (in another terminal or after server starts)
```bash
cd frontend
npm run dev
```
