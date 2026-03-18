const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createScene,
  getScenes,
  deleteScene
} = require('../controllers/sceneController');

router.post('/', auth, createScene);
router.get('/:project_id', auth, getScenes);
router.delete('/:id', auth, deleteScene);

module.exports = router;