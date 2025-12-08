const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { asyncHandler } = require('../middleware/errorMiddleware');

exports.register = asyncHandler(async (req, res) => {
  const { nom, email, password, role, telephone, permis } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'Email déjà utilisé' });
  }

  const user = await User.create({ nom, email, password, role, telephone, permis });

  res.status(201).json({
    _id: user._id,
    nom: user.nom,
    email: user.email,
    role: user.role,
    token: generateToken(user._id)
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
  }

  res.json({
    _id: user._id,
    nom: user.nom,
    email: user.email,
    role: user.role,
    token: generateToken(user._id)
  });
});
