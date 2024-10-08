// frontend/src/Post.js
import React from 'react';
import './Post.css';

const Post = ({ post }) => {
  return (
    <div className="post-card">
      <img className="avatar" src={post.avatar} alt={post.user} />
      <div className="post-content">
        <h2>{post.title}</h2>
        <p>{post.content}</p>
        <div className="post-info">
          <span>{post.user}</span>
          <span>{post.date}</span>
        </div>
      </div>
    </div>
  );
};

export default Post;
