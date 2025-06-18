import { Request, Response, NextFunction } from 'express';
import { hashPassword, generateAccessToken, generateRefreshToken, comparePassword, verifyToken } from '../utils/helper';
import User from '../models/user.model';

export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  // Validate request body
  console.log('Request body:', req.body);
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ success: false, message: 'Request body is missing' });
  }

  const { username, email, password } = req.body;
  let {profilePic} = req.body;

  console.log('Parsed body:', { username, email, password, profilePic });

   profilePic = {
    data: profilePic?.buffer || null, // Assuming profilePic is a file object
    contentType: profilePic?.mimetype || 'image/jpeg', // Default content type if not provided
   }
  
  // Check if all required fields are present
  if (!username || !email || !password ) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

    // Check if password meets criteria (e.g., length)
    if (password.length < 6) {      
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
   }
    // Check if email is valid  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    //hash password (in a real application, use a library like bcrypt)
     const hashedPassword = await hashPassword(password);
     console.log('Hashed password:', hashedPassword);

    // Here you would typically save the user to the database
     const user = {
      username,
      email,
      password: hashedPassword, // Store the hashed password
      profilePic, // Assuming profilePic is a file object 
    };

    // check user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const newUser = await User.create(user);
    if (!newUser) {
      return res.status(500).json({ succes: false,message: 'Failed to create user' });
    }
    const refreshToken = generateRefreshToken(newUser._id.toString());
    const accessToken = generateAccessToken(newUser._id.toString());
    // console.log('Generated token:', token);
    newUser.refreshToken = refreshToken; // Store the refresh token in the user document
    await newUser.save(); // Save the user document with the refresh token
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false, // Use secure cookies in production
      sameSite: 'none', // Prevent CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser._id.toString(),
        username: newUser.username,
        email: newUser.email,
      },
      token: accessToken, // Return the generated token
    });
   
 }


export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const refreshToken = generateRefreshToken(user._id.toString());
    const accessToken = generateAccessToken(user._id.toString());

    user.refreshToken = refreshToken; // Store the refresh token in the user document
    await user.save(); // Save the user document with the refresh token
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false, // Use secure cookies in production
      sameSite: 'none', // Prevent CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
      },
      token: accessToken, // Return the generated access token
    });
 } catch (error) {
    next(error);
  }
};


export const refreshToken = async (req: Request, res: Response): Promise<any> => {
  // console.log('Received refresh token request');
  // console.log('Request cookies:', req.cookies);
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: 'No refresh token' });
    // console.log('Received refresh token:', token);
  try {
    const decoded: any = verifyToken(token, process.env.JWT_REFRESH_SECRET as string);
    if (typeof decoded === 'object' && decoded !== null && 'userId' in decoded){
        const user = await User.findById(decoded.userId);
        if (!user || user.refreshToken !== token)
          return res.status(401).json({ message: 'Invalid refresh token' });

        const newAccessToken = generateAccessToken(user._id.toString());
        res.json({ token: newAccessToken });
    } 
   
    
  } catch {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};


export const logoutUser = async (req: Request, res: Response): Promise<any> => {
  const token = req.cookies.refreshToken;
  if (token) {
    const decoded = verifyToken(token, process.env.JWT_REFRESH_SECRET as string);
    if (typeof decoded === 'object' && decoded !== null && 'userId' in decoded){
      if (decoded) {
      await User.findByIdAndUpdate(decoded.userId, { refreshToken: '' });
      }
    } 
  }
  res.clearCookie('refreshToken').json({ message: 'Logged out' });
};