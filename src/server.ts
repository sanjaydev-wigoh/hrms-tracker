
// server.ts
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { PrismaClient, UserAttendance } from '@prisma/client';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

const prisma = new PrismaClient();
let lastKnownIds: Set<string> = new Set();

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  const records = await prisma.userAttendance.findMany({ orderBy: { date: 'desc' } });
  res.json(records);
});

app.post('/notify', (req, res) => {
  const attendance = req.body;
  io.emit('attendance-update', attendance);
  res.status(200).json({ message: 'Notified' });
});

// 🔁 Poll for deletions every 5 seconds
setInterval(async () => {
  const allRecords: UserAttendance[] = await prisma.userAttendance.findMany();
  const currentIds = new Set(allRecords.map((r) => r.id));

  // Find deleted IDs
  for (const id of lastKnownIds) {
    if (!currentIds.has(id)) {
      io.emit('attendance-delete', { id });
    }
  }

  lastKnownIds = currentIds;
}, 5000);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
});

server.listen(3001, () => {
  console.log('✅ Socket.IO server running on http://localhost:3001');
});
