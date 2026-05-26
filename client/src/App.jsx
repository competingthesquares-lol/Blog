import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [posts, setPosts] = useState([]);
    const [selectedPostId, setSelectedPostId] = useState(
    useEffect(() => {
    // 1. Fetch the data from your Express server
    fetch('http://localhost:5000/api/posts')
      .then(response => response.json())
      .then(data => {
        // 2. Save the fetched blog posts into our state
        setPosts(data);
      })
      .catch(error => console.error('Error fetching posts:', error));
  }, []);

  return (
    <div className="main">
      <div className="articles">
        {/* 📝 New Post Form */}
        <form className="new-post-form">
          <input type="text" placeholder="Post Title" />
          <textarea placeholder="Write your blog post here..."></textarea>
          <button type="submit">Publish Post</button>
        </form>
        {activePost ? (
          // 📄 Single Post View
          <article className="single-post">
            <button onClick={() => setSelectedPostId(null)}>Back to Posts</button>
            <h2>{activePost.title}</h2>
            <p>{activePost.text}</p>
          </article>
        ) : (
          // 📑 All Posts List View
          posts.map(post => (
            <article key={post._id} className="post">
              <h2 onClick={() => setSelectedPostId(post._id)} style={{ cursor: 'pointer' }}>
                {post.title}
              </h2>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

export default App
