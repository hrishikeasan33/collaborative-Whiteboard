// backend/server.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Generate dummy posts data
const posts = Array.from({ length: 10000 }, (v, i) => ({
  id: i + 1,
  title: `Post Title ${i + 1}`,
  content: `This is the content of post ${i + 1}`,
  user: `User ${i + 1}`,
  date: new Date().toLocaleDateString(),
  avatar: `https://i.pravatar.cc/150?img=${i + 1}`
}));

// API endpoint to get posts with pagination
app.get('/posts', (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  const start = (pageNumber - 1) * limitNumber;
  const end = start + limitNumber;

  const paginatedPosts = posts.slice(start, end);
  const hasMore = end < posts.length;

  res.json({
    posts: paginatedPosts,
    hasMore
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
