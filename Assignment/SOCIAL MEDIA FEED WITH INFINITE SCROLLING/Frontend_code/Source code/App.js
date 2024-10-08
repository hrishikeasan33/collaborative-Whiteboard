// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import Post from './Post';
import './App.css';

const LIMIT = 10; // Number of posts to fetch per page

function App() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hasMore) {
      loadMorePosts(page);
    }
  }, [page]);

  const loadMorePosts = async (pageNumber) => {
    if (loading) return;

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/posts?page=${pageNumber}&limit=${LIMIT}`);
      const data = await res.json();
      setPosts((prevPosts) => [...prevPosts, ...data.posts]);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
    setLoading(false);
  };

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore]);

  return (
    <div className="App">
      <h1>Social Media Feed</h1>
      <div className="feed">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Post key={post.id} post={post} />
          ))
        ) : (
          <p>No posts available</p>
        )}
      </div>
      {loading && <p>Loading...</p>}
      {!hasMore && <p>No more posts available.</p>}
    </div>
  );
}

export default App;
