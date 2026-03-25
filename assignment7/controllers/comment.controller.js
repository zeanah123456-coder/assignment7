const Comment = require("../models/comment.model");
const User = require("../models/user.model");
const Post = require("../models/post.model");
const { Op } = require("sequelize");


exports.createComments = async (req, res) => {
  try {
    const { comments } = req.body;

    await Comment.bulkCreate(comments);

    res.json({ message: "Comments created." });
  } catch (err) {
    res.json({ error: err.message });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId, content } = req.body;

    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.json({ message: "comment not found." });
    }

    if (comment.userId != userId) {
      return res.json({
        message: "You are not authorized to update this comment."
      });
    }

    comment.content = content;
    await comment.save();

    res.json({ message: "Comment updated." });
  } catch (err) {
    res.json({ error: err.message });
  }
};


exports.findOrCreateComment = async (req, res) => {
  try {
    const { postId, userId, content } = req.body;

    const [comment, created] = await Comment.findOrCreate({
      where: {
        postId,
        userId,
        content
      },
      defaults: {
        postId,
        userId,
        content
      }
    });

    res.json({ comment, created });
  } catch (err) {
    res.json({ error: err.message });
  }
};

exports.searchComments = async (req, res) => {
  try {
    const { word } = req.query;

    const result = await Comment.findAndCountAll({
      where: {
        content: {
          [Op.like]: `%${word}%`
        }
      }
    });

    if (result.count === 0) {
      return res.json({ message: "no comments found." });
    }

    res.json({
      count: result.count,
      comments: result.rows
    });
  } catch (err) {
    res.json({ error: err.message });
  }
};


exports.getNewestComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.findAll({
      where: { postId },
      attributes: ["id", "content", "createdAt"],
      order: [["createdAt", "DESC"]],
      limit: 3
    });

    res.json(comments);
  } catch (err) {
    res.json({ error: err.message });
  }
};


exports.getCommentDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findByPk(id, {
      attributes: ["id", "content"],
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"]
        },
        {
          model: Post,
          attributes: ["id", "title", "content"]
        }
      ]
    });

    if (!comment) {
      return res.json({ message: "no comment found" });
    }

    res.json(comment);
  } catch (err) {
    res.json({ error: err.message });
  }
};