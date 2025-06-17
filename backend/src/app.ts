import express from 'express';
import { requestLogger } from './middlewares/logger.middleware';
import { errorLogger } from './middlewares/errorLogger.middleware';
import { connectDB } from './config/connectToDB';
import authRoutes from './routes/auth.routes';


const app = express();
app.use(express.json());
// Middleware to log requests
app.use(requestLogger);
// Connect to the database
connectDB();

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Error handling middleware
app.use(errorLogger);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



export default app;