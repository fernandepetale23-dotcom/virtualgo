const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Inscription
exports.register = async (req, res) => {
  const { nom, email, mot_de_passe } = req.body;
  try {
    const userExist = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(mot_de_passe, salt);
    const newUser = await pool.query(
      'INSERT INTO users (nom, email, mot_de_passe) VALUES ($1, $2, $3) RETURNING *',
      [nom, email, hashedPassword]
    );
    const token = jwt.sign({ id: newUser.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: newUser.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// Connexion
exports.login = async (req, res) => {
  const { email, mot_de_passe } = req.body;
  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Utilisateur non trouvé' });
    }
    const validPassword = await bcrypt.compare(mot_de_passe, user.rows[0].mot_de_passe);
    if (!validPassword) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }
    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: user.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};