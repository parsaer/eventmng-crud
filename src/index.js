import express from 'express'
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import adminRoutes from './routes/admin.js';
import authMiddleWare from './middleware/auth.js';
import adminMiddleWare from './middleware/admin.js';
import arcjetMiddleWare from './middleware/arcjet.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
// app.use(arcjetMiddleWare)

app.get('/', (req, res) => {
  res.send("Health check!");
})

app.use("/api/auth", authRoutes);
app.use('/api/events', eventRoutes);
app.use('/admin', adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
})