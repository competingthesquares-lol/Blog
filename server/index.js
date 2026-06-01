const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const PORT = 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist')));

// --- 1. DATABASE CONNECTION ---
mongoose.connect('mongodb://127.0.0.1:27017/simple_api')
    .then(() => console.log('Connected to MongoDB successfully!'))
    .catch(err => {
        console.error('Could not connect to MongoDB. Is your MongoDB service running?');
        console.error(err.message);
    });

// --- 2. MONGOOSE MODEL ---
const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

// --- 3. API ROUTES (Must come BEFORE the catch-all) ---

// THE MISSING GET ROUTE: Fetch all posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 }); // Sorts newest first
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/posts', async (req, res) => {
  try {
    const newPost = new BlogPost({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags
    });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/posts/:id', async (req, res) => {
  try {
    const updatedPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedPost) return res.status(404).json({ message: 'Post not found' });
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/posts/:id', async (req, res) => {
  try {
    const deletedPost = await BlogPost.findByIdAndDelete(req.params.id);
    if (!deletedPost) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post deleted successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- 4. CATCH-ALL ROUTE (Must be the VERY LAST route) ---
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// --- 5. START SERVER ---
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
