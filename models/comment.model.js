const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class Comment extends Model {}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    content: {
      type: DataTypes.TEXT
    },
    postId: {
      type: DataTypes.INTEGER
    },
    userId: {
      type: DataTypes.INTEGER
    }
  },
  {
    sequelize,
    modelName: "Comment",
    timestamps: true
  }
);

module.exports = Comment;