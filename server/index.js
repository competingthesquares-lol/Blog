const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const PORT = 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist')));

mongoose.connect('mongodb://127.0.0.1:27017/simple_api')
    .then(() => console.log('Connected to MongoDB successfully!'))
    .catch(err => {
        console.error('Could not connect to MongoDB. Is your MongoDB service running?');
        console.error(err.message);
    });



app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});


const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true // A post must have a title
  },
  text: {
    type: String,
    required: true // A post must have content
  },
  tags: {
    type: [String], // This syntax means "an array of strings"
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now // Mongoose will automatically set the exact time it's created
  }
});

// We turn the schema into a Model so we can interact with it in other files
const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = BlogPost;




app.delete('/api/posts/:id', async (req, res) => {
  try {
    const deletedPost = await BlogPost.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ message: 'Post deleted successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/posts/:id', async (req, res) => {
  try {
    // We pass the ID to find the post, and req.body to provide the updated data
    const updatedPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // This tells Mongoose to send back the newly updated version
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/posts', async (req, res) => {
  try {
    // We create a new post using the data from req.body
    const newPost = new BlogPost({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags
    });

    const savedPost = await newPost.save(); // Saves it to MongoDB
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
