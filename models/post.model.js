const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class Post extends Model {}

Post.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING
  },
  content: {
    type: DataTypes.TEXT
  },
  userId: {
    type: DataTypes.INTEGER
  }
}, {
  sequelize,
  modelName: "Post",
  timestamps: true,
  paranoid: true
});

module.exports = Post;