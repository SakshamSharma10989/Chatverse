// utils/generateToken.js
import jwt from 'jsonwebtoken';

const generateTokenandsetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.cookie('jwt', token, {
    httpOnly: true, // Secure cookie
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: 'strict', // Prevent CSRF
  });
  return token; // Return the token
};

export default generateTokenandsetCookie;