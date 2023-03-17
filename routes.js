const express = require("express");
const { createPost, deletePost, likePost, unlikePost, addComment, getPost, getUserPosts } = require("./controllers/Post");
const {
  authenticate,
  follow,
  unfollow,
  userProfile,
} = require("./controllers/User");
const { validUserToken } = require("./middleware/Auth");

const router = express.Router();

router.post("/authenticate", authenticate);
router.post("/follow/:id", validUserToken, follow);
router.post("/unfollow/:id", validUserToken, unfollow);
router.get("/user", validUserToken, userProfile);
router.post("/posts", validUserToken, createPost);
router.delete("/posts/:id", validUserToken, deletePost);
router.post("/like/:id", validUserToken, likePost);
router.post('/unlike/:id',validUserToken,unlikePost);
router.post('/comment/:id',validUserToken,addComment);
router.get('/posts/:id',getPost);
router.get('/all_posts',validUserToken,getUserPosts);

module.exports = router;
