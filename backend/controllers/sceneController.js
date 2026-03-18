const pool = require('../config/db');

// Créer une scène
exports.createScene = async (req, res) => {
  const { titre, image_url, project_id } = req.body;
  try {
    const newScene = await pool.query(
      'INSERT INTO scenes (titre, image_url, project_id) VALUES ($1, $2, $3) RETURNING *',
      [titre, image_url, project_id]
    );
    res.status(201).json(newScene.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// Obtenir toutes les scènes d'un projet
exports.getScenes = async (req, res) => {
  const { project_id } = req.params;
  try {
    const scenes = await pool.query(
      'SELECT * FROM scenes WHERE project_id = $1 ORDER BY created_at DESC',
      [project_id]
    );
    res.json(scenes.rows);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// Supprimer une scène
exports.deleteScene = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM scenes WHERE id = $1', [id]);
    res.json({ message: 'Scène supprimée' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};