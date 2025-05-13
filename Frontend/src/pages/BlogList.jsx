import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BlogPreview from '../components/BlogPreview';
import '../styles/BlogList.css';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('/api/blogs/published');
        setBlogs(response.data);
      } catch (error) {
        console.error('Error loading blogs:', error);
        setError('Failed to load blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <div className="loading">Loading blogs...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="blog-list-container">
      <h1>Latest Blogs</h1>
      {blogs.length === 0 ? (
        <p className="no-blogs">No blog posts available yet.</p>
      ) : (
        <div className="blog-grid">
          {blogs.map((blog) => (
            <BlogPreview key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList; 