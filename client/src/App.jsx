import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [posts, setPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null); 

  useEffect(() => {
    fetch('http://localhost:5000/api/posts')
      .then(response => response.json())
      .then(data => {
        setPosts(data);
      })
      .catch(error => console.error('Error fetching posts:', error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (!title || !text) return alert("Please fill out both fields!");

    const newPostData = { title, text };

    try {
      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPostData)
      });

      const savedPost = await response.json();
      setPosts([savedPost, ...posts]);

      setTitle('');
      setText('');
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); 
    
    if (!window.confirm("Are you sure you want to delete this blog post?")) return;

    try {
      await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: 'DELETE'
      });
      
      setPosts(posts.filter(post => post._id !== id));
      
      if (selectedPostId === id) setSelectedPostId(null);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const activePost = posts.find(p => p._id === selectedPostId);

  return (
    <div className="main">
      <div className="form-container">
        <h2>Create a New Post</h2>
        <form onSubmit={handleSubmit} className="new-post-form">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post Title"
            className="form-input"
          />
          <textarea 
            value={text} 
            onChange={(e) => setText(e.target.value)} 
            placeholder="Write your blog post here..."
            className="form-textarea"
          ></textarea>
          <button type="submit" className="btn-submit">Publish Post</button>
        </form>
      </div>
      
      <div className="articles">
        {activePost ? (
          <article className="single-post">
            <button className="btn-back" onClick={() => setSelectedPostId(null)}>← Back to Posts</button>
            <h2>{activePost.title}</h2>
            <p className="post-content">{activePost.text}</p>
            <button className="btn-delete" onClick={(e) => handleDelete(activePost._id, e)}>Delete Post</button>
          </article>
        ) : (
          posts.map(post => (
            <article key={post._id} className="post-card" onClick={() => setSelectedPostId(post._id)}>
              <div className="post-card-header">
                <h2>{post.title}</h2>
                <button className="btn-delete-small" onClick={(e) => handleDelete(post._id, e)}>×</button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
