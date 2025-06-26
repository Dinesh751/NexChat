import express from 'express';
import { requestLogger } from './middlewares/logger.middleware';
import { errorLogger } from './middlewares/errorLogger.middleware';
import { connectDB } from './config/connectToDB';
import authRoutes from './routes/auth.routes';
import chatRoutes from './routes/chat.routes';
import { fileUploadMiddleware } from './middlewares/fileUpload.middleware';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();


const app = express();
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000', // Allow requests from the client URL
  credentials: true, // Allow cookies to be sent with requests
}));
app.use(cookieParser()); // Middleware to parse cookies

// Middleware to log requests
app.use(requestLogger);
// Connect to the database
connectDB();

app.use('/api/v1/auth',fileUploadMiddleware, authRoutes);
app.use('/api/v1/chats',fileUploadMiddleware, chatRoutes);


const PORT = process.env.SERVER_PORT || 8000;



// Error handling middleware
app.use(errorLogger);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
