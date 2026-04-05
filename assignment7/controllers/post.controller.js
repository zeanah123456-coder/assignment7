const Post = require("../models/post.model");
const User = require("../models/user.model");
const Comment = require("../models/comment.model");
const sequelize = require("../config/db");
const { fn, col } = require("sequelize");

// 1) Create new post
const createPost = async (req, res) => {
  try {
    const { title, content, userId } = req.body;

    const post = new Post({
      title,
      content,
      userId
    });

    await post.save();

    res.json({ message: "Post created successfully." });
  } catch (error) {
    res.json({ error: error.message });
  }
};

// 2) Delete post by id (only owner)
const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    const post = await Post.findByPk(postId);

    if (!post) {
      return res.json({ message: "Post not found." });
    }

    if (post.userId != userId) {
      return res.json({ message: "You are not authorized to delete this post." });
    }

    await post.destroy();

    res.json({ message: "Post deleted." });
  } catch (error) {
    res.json({ error: error.message });
  }
};

// 3) Retrieve all posts with user details and comments
const getPostsDetails = async (req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: ["id", "title"],
      include: [
        {
          model: User,
          attributes: ["id", "name"]
        },
        {
          model: Comment,
          attributes: ["id", "content"]
        }
      ]
    });

    res.json(posts);
  } catch (error) {
    res.json({ error: error.message });
  }
};

// 4) Retrieve all posts with comment count
const getPostsCommentCount = async (req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: [
        "id",
        "title",
        [fn("COUNT", col("Comments.id")), "commentCount"]
      ],
      include: [
        {
          model: Comment,
          attributes: []
        }
      ],
      group: ["Post.id"]
    });

    res.json(posts);
  } catch (error) {
    res.json({ error: error.message });
  }
};

module.exports = {
  createPost,
  deletePost,
  getPostsDetails,
  getPostsCommentCount
};