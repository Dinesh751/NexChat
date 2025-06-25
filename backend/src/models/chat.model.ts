import mongoose, { Schema, Document } from 'mongoose';

// Define Message Interface
interface IMessage extends Document {
  senderId: mongoose.Types.ObjectId;
  text: string;
  timestamp: Date;
  readBy: mongoose.Types.ObjectId[];
}

// Define Chat Interface
interface IChat extends Document {
  chatName: string;
  profilePic: {
    data: Buffer;
    contentType: string;
  };
  users: mongoose.Types.ObjectId[];
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// Message Schema
const MessageSchema = new Schema<IMessage>({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  readBy: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
});

// Chat Schema
// In your chat.model.ts
const ChatSchema = new Schema<IChat>({
  chatName: { type: String, default: null },
  profilePic: {
    data: Buffer,
    contentType: String,
  },
  users: [{ type: mongoose.Types.ObjectId, ref: 'User', required: true }],
  messages: [MessageSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Chat = mongoose.model<IChat>('Chat', ChatSchema);
export default Chat;
