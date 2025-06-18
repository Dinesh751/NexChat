import mongoose from 'mongoose';
import { rootCertificates } from 'tls';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: {
    data: Buffer, // Store image buffer
    contentType: String, // Store image MIME type
  },
  refreshToken:  {type: String, default: '' },
});

const User = mongoose.model('User', userSchema);
export default User;
