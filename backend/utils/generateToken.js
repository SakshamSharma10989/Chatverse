// utils/generateToken.js
import jwt from 'jsonwebtoken';

const generateTokenandsetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
 res.cookie('jwt', token, {
  httpOnly: true,
  secure: true, // 🔥 REQUIRED for HTTPS (like Vercel)
  sameSite: 'None', // 🔥 REQUIRED for cross-origin cookies
  maxAge: 24 * 60 * 60 * 1000, // 1 day
});

  return token; // Return the token
};

export default generateTokenandsetCookie;