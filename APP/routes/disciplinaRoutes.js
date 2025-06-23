const express = require('express');
const router = express.Router();
const disciplinaController = require('../controllers/disciplinaController');

// GET /disciplinas
router.get('/', disciplinaController.listarDisciplinas);

module.exports = router;
