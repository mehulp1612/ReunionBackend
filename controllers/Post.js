const Post = require("../models/Post");
const { Success, AppError } = require("../utils");

const createPost = async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description)
    return res.status(400).json(AppError("invalidRequest", "Missing Params"));

  const newPost = new Post({
    title,
    description,
    createdBy: req.user._id,
    likes: [],
    comments: [],
  });

  const postCreated = await newPost.save();

  console.log(postCreated);

  return res.status(200).json(
    Success(
      "Post Created",
      {},
      {
        PostId: postCreated._id,
        description: postCreated.description,
        title: postCreated.title,
        CreatedTime: new Date(postCreated.createdAt).toUTCString(),
      }
    )
  );
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  // console.log(req.user._id);

  const post = await Post.findById(id);
  // console.log(post);
  if (!post)
    return res.status(404).json(AppError("notFoundError", "Post not found"));

  if (!post.createdBy.equals(req.user._id))
    return res
      .status(403)
      .json(AppError("authorizationError", "Unauthorized to delete"));

  await Post.deleteOne(post);

  return res.status(200).json(Success("Post deleted successfully"));
};

const likePost = async (req, res) => {
  const { id } = req.params;

  const post = await Post.findById(id);

  if (!post)
    return res.status(404).json(AppError("notFoundError", "Post not Found"));

  if (!post.likes.includes(req.user._id)) {
    post.likes.push(req.user._id);
    await post.save();
  }

  return res.status(200).json(Success("Post liked"));
};

const unlikePost = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  // console.log(post);
  if (!post)
    return res.status(404).json(AppError("notFoundError", "Post not Found"));

  if (post.likes.includes(req.user._id)) {
    post.likes.pull({ _id: req.user._id });
    console.log(post);
    await post.save();
  }

  return res.status(200).json(Success("Post unliked"));
};

const addComment = async (req, res) => {
  const { comment } = req.body;
  const { id } = req.params;

  if (!comment)
    return res.status(400).json(AppError("invalidRequest", "Missing Params"));
  const post = await Post.findById(id);
  if (!post)
    return res.status(404).json(AppError("notFoundError", "Post not Found"));

  post.comments.push({
    text: comment,
    commentBy: req.user._id,
  });

  // console.log(post);
  await post.save();
  return res.status(201).json(
    Success("Comment Added", null, {
      CommentId: post.comments[post.comments.length - 1]._id,
    })
  );
};

const getPost = async (req, res) => {
  const { id } = req.params;

  const post = await Post.findById(id)
    .lean()
    .select("title description createdAt likes.length comments.length");
  console.log(post);
  if (!post)
    return res.status(404).json(AppError("notFoundError", "Post not Found"));

  return res.status(200).json(
    Success(
      "Post Found",
      {},
      {
        ...post,
        likes: post.likes.length,
        comments: post.comments.length,
      }
    )
  );
};

const getUserPosts = async(req,res) =>{

  const posts = await Post.find({createdBy:req.user._id}).select('title description comments likes createdAt _id').sort({['createdAt']:-1}).populate({path:'comments.commentBy',select:'name'}).lean();
  if(!posts) return res.status(404).json
  posts.map((post)=>{
    post.comments.map((comment,ind)=>{
      post.comments[ind]={text:comment.text,commentBy:comment.commentBy.name}
    })
    post.likes=post.likes.length
});

res.status(200).json(Success("Post Fetched",{},{posts}));

}
module.exports = {
  createPost,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  getPost,
  getUserPosts
};
