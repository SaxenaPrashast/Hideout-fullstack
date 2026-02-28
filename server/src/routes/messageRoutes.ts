import { Router } from 'express';
import {
  getRooms,
  createOrGetDMRoom,
  createGroupRoom,
  getRoomMessages,
  sendMessage,
  markMessageAsRead,
  getUsers,
} from '../controllers/messageController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// All routes are protected
router.use(authMiddleware);

router.get('/users', getUsers);
router.get('/rooms', getRooms);
router.post('/rooms', createOrGetDMRoom);
router.post('/rooms/group', createGroupRoom);
router.get('/rooms/:roomId/messages', getRoomMessages);
router.post('/rooms/:roomId/messages', sendMessage);
router.put('/messages/:msgId/read', markMessageAsRead);

export default router;
