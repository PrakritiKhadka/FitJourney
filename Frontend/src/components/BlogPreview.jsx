import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/BlogPreview.css';

const BlogPreview = ({ blog }) => {
  return (
    <div className="blog-preview">
      <h2 className="blog-title">
        <Link to={`/blog/${blog._id}`}>{blog.title}</Link>
      </h2>
      <div className="blog-meta">
        <span className="blog-author">By {blog.author}</span>
        <span className="blog-date">
          {new Date(blog.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default BlogPreview; 