import express from 'express';
import { addUserToGroup, createGroup, getContactsAndGroups, getConversation, postChat} from '../controllers/chat.controller';

const router = express.Router();

router.post('/create-group', createGroup );
router.post('/groups/:groupId/adduser', addUserToGroup );
router.get('/contacts-and-groups/:userId', getContactsAndGroups );
router.post('/message', postChat );
router.get('/conversations', getConversation);

export default router;