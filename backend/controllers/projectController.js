const pool = require('../config/db');

// Créer un projet
exports.createProject = async (req, res) => {
  const { titre, description } = req.body;
  const userId = req.user.id;
  try {
    const newProject = await pool.query(
      'INSERT INTO projects (titre, description, user_id) VALUES ($1, $2, $3) RETURNING *',
      [titre, description, userId]
    );
    res.status(201).json(newProject.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// Obtenir tous les projets de l'utilisateur
exports.getProjects = async (req, res) => {
  const userId = req.user.id;
  try {
    const projects = await pool.query(
      'SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(projects.rows);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// Obtenir un projet par ID
exports.getProjectById = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
    if (project.rows.length === 0) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }
    res.json(project.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// Supprimer un projet
exports.deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM projects WHERE id = $1', [id]);
    res.json({ message: 'Projet supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};