import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();


router.post('/sign-up', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.json({ message: 'User created successfully' });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
})

router.post("/sign-in", async (req, res) => {
  const  { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if(!user) return res.status(401).json({ error: "invalid credentials"})

    const valid = await bcrypt.compare(password, user.password);
    if(!valid) return res.status(401).json({ error: "invalid credentials"})
    
    const token = jwt.sign({ id: user._id, email, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
    
    
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;