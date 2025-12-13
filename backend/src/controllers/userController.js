const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};

exports.updateUser = async (req, res) => {
  const { nom, email, role } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { nom, email, role },
    { new: true }
  ).select('-password');
  res.json(user);
};

exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
};
