const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER (Sign up a new user)
router.post('/register', async (req, res) => 
{
  try 
  {
    const { username, password } = req.body;
    // 1. Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // 2. Create the user
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } 
  
  catch (error) 
  {
    res.status(500).json({ error: 'Error creating user' });
  }

});

// LOGIN (Get a token)
router.post('/login', async (req, res) => 
{
  try 
  {
    const { username, password } = req.body;
    // 1. Find user
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'User not found' });

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid password' });

    // 3. Generate Token (The "ID Card")
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } 
    catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

module.exports = router;