const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io"); 


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("❌ MONGO_URI is not defined. Please check your .env file.");
  process.exit(1);
}

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

const messageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  text: { type: String, required: true },
  chatId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  priority: { type: String, enum: ['normal', 'urgent', 'important'], default: 'normal' },
  taggedUsers: [String]
});
const Message = mongoose.model('Message', messageSchema);

const chatSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['group', 'private'], required: true },
  users: [String],
  admin: String,
  schedule: {
    time: Date,
    room: String
  }
});
const Chat = mongoose.model('Chat', chatSchema);

const projectRoutes = require("./routes/projects");
const taskRoutes = require("./routes/tasks");
const collaboratorRoutes = require("./routes/collaborators");

app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);
app.use("/collaborators", collaboratorRoutes);

const server = http.createServer(app);
const io = new Server(server, { 
  cors: {
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"],
  },
});

io.on('connection', (socket) => {
  console.log('New client connected', socket.id);

  socket.on('joinChat', (chatId) => {
    socket.join(chatId);
    console.log(`User joined chat: ${chatId}`);
  });

  socket.on('sendMessage', async (message) => {
    try {
      const newMessage = new Message(message);
      await newMessage.save();
      io.to(message.chatId).emit('newMessage', newMessage);  
      console.log('Message sent:', newMessage);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('prioritizeMessage', async ({ messageId, priority }) => {
    try {
      const message = await Message.findByIdAndUpdate(messageId, { priority }, { new: true });
      io.to(message.chatId).emit('messagePrioritized', message);
    } catch (error) {
      console.error('Error prioritizing message:', error);
    }
  });

  socket.on('tagUser', async ({ messageId, userId }) => {
    try {
      const message = await Message.findByIdAndUpdate(messageId, { $push: { taggedUsers: userId } }, { new: true });
      io.to(message.chatId).emit('userTagged', message);
    } catch (error) {
      console.error('Error tagging user:', error);
    }
  });

  socket.on('scheduleMeeting', async ({ chatId, time, room }) => {
    try {
      const chat = await Chat.findByIdAndUpdate(chatId, { schedule: { time, room } }, { new: true });
      io.to(chatId).emit('meetingScheduled', chat);
    } catch (error) {
      console.error('Error scheduling meeting:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
