import express from 'express';
import { getConversation, postChat} from '../controllers/chat.controller';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Chat route is working!' });
});
router.post('/send-message', postChat );
router.get('/get-chat/:chatId', getConversation);

export default router;