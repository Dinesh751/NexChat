import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

// Initialize multer without storage configuration
const upload = multer();

// Middleware to handle a single file upload
export const fileUploadMiddleware = (req: Request, res: Response, next: NextFunction) => {
  upload.single('profilePic')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: 'File upload error', error: err.message });
    }

    // If a file exists, add it to req.body.profilePic (instead of req.files)
    if (req.file) {
      req.body.profilePic = req.file; // Directly attach the file to req.body
    }

    next();
  });
};