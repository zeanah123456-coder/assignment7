const User = require("../models/user.model");

// 1) Signup
const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({
      where: { email }
    });

    if (existingUser) {
      return res.json({ message: "Email already exists." });
    }

    await User.create({
      name,
      email,
      password,
      role
    });

    res.json({ message: "User added successfully." });
  } catch (error) {
    res.json({ error: error.message });
  }
};

// 2) Upsert user
const upsertUser = async (req, res) => {
  try {
    const { id } = req.params;

    await User.upsert(
      {
        id,
        ...req.body
      },
      {
        validate: false
      }
    );

    res.json({ message: "User created or updated successfully" });
  } catch (error) {
    res.json({ error: error.message });
  }
};

// 3) Get user by email
const getByEmail = async (req, res) => {
  try {
    const { email } = req.query;

    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      return res.json({ message: "no user found" });
    }

    res.json({ user });
  } catch (error) {
    res.json({ error: error.message });
  }
};

// 4) Get user by PK without role
const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ["role"] }
    });

    if (!user) {
      return res.json({ message: "no user found" });
    }

    res.json(user);
  } catch (error) {
    res.json({ error: error.message });
  }
};

module.exports = {
  signup,
  upsertUser,
  getByEmail,
  getById
};