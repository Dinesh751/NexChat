import { Request, Response } from 'express';
import Chat from '../models/chat.model';
import User from '../models/user.model';

/**
 * Controller to handle chat-related operations.
 * Includes creating group chats and posting messages.
 */



export const createGroup = async (req: Request, res: Response): Promise<any> => {
  try {
    let { chatName, users, profilePic } = req.body;
       users = JSON.parse(users); // Ensure users is an array
    console.log('Creating group with:', { chatName, users, profilePic });

    // Validation
    if (
      !chatName ||
      !users ||
      !Array.isArray(users) ||
      users.length < 2 // group must have at least 2 users
    ) {
      return res.status(400).json({ error: 'Group must have a name and at least 2 users.' });
    }

    // Check if group with same users and name exists
    const existingGroup = await Chat.findOne({
      users: { $all: users, $size: users.length },
      chatName
    });

    if (existingGroup) {
      return res.status(409).json({ error: 'Group with same users and name already exists.' });
    }

    // Create new group chat
    const group = new Chat({
      chatName,
      users,
      profilePic, // should be { data, contentType } or handle file upload separately
      messages: [],
    });

    const savedGroup = await group.save();
    return res.status(201).json(savedGroup);
  } catch (err) {
    console.error('Error in createGroup:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const addUserToGroup = async (req: Request, res: Response): Promise<any> => {
  try {
    const { groupId } = req.params; // groupId from URL param
    const { userId } = req.body;    // userId from body

    if (!groupId || !userId) {
      return res.status(400).json({ error: 'groupId and userId are required.' });
    }

    // Find the group chat
    const group = await Chat.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found.' });
    }

    // Check if user is already in the group
    if (group.users.some(u => u.toString() === userId)) {
      return res.status(409).json({ error: 'User already in the group.' });
    }

    // Add user to group
    group.users.push(userId);
    await group.save();

    return res.status(200).json({ message: 'User added to group.', group });
  } catch (err) {
    console.error('Error in addUserToGroup:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


// GET /api/chats/contacts-and-groups/:userId
export const getContactsAndGroups = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId } = req.params;

    // Fetch all users except the current user
    const users = await User.find({ _id: { $ne: userId } }).select('-password -email -profilePic -refreshToken');

    // Fetch all group chats the user is part of (users.length > 2 and chatName not null)
    const groups = await Chat.find({
      users: userId,
      chatName: { $ne: null },
      'users.2': { $exists: true }
    }).select('-profilePic');

    return res.status(200).json({ users, groups });
  } catch (err) {
    console.error('Error in getContactsAndGroups:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const postChat = async (req: Request, res: Response): Promise<any> => {
   try {
      const { chatName, users, messages } = req.body;
      if (
        !users ||
        !Array.isArray(users) ||
        users.length < 2 ||
        (users.length > 2 && !chatName) ||
        !messages || !messages.senderId || !messages.text
      ) {
        return res.status(400).json({ error: 'Invalid input data.' });
      }
      let chat = null;
      // 1-to-1 chat: check if chat already exists
      if (users.length === 2) {
        chat = await Chat.findOne({
          users: { $all: users, $size: 2 },
          chatName: null
        });
      } else {
        // Group chat: check if a group with same users and name exists
        chat = await Chat.findOne({
          users: { $all: users, $size: users.length },
          chatName
        });
      }
      if (chat) {
        // Push new message to existing chat
        (chat as any).messages.push(messages);
        await chat.save();
        return res.status(200).json(chat);
      }
      // Create new chat with initial message
      chat = new Chat({
        chatName: users.length === 2 ? null : chatName,
        users,
        messages: [messages],
      });
      const savedChat = await chat.save();
      return res.status(201).json(savedChat);
   } catch (err) {
      console.error('Error in postChat:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
   }
};


// GET /api/chats/conversation
// Accepts either { chatId } or { userId1, userId2 } in req.body or req.query
export const getConversation = async (req: Request, res: Response): Promise<any> => {
  try {
    const { chatId, userId1, userId2 } = req.query;

    let chat = null;

    if (chatId) {
      // Find by chatId (group or 1-to-1)
      chat = await Chat.findById(chatId)
    } else if (userId1 && userId2) {
      // Find 1-to-1 chat by user IDs
      chat = await Chat.findOne({
        users: { $all: [userId1, userId2], $size: 2 },
        chatName: null
      })
    } else {
      return res.status(400).json({ error: 'Provide either chatId or both userId1 and userId2.' });
    }

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    return res.status(200).json(chat);
  } catch (err) {
    console.error('Error in getConversation:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};



