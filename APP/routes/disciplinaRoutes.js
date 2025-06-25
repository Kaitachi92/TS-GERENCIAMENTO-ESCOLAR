const express = require('express');
const router = express.Router();
const disciplinaController = require('../controllers/disciplinaController');

// GET /disciplinas
router.get('/', disciplinaController.listarDisciplinas);

// POST /disciplinas
router.post('/', disciplinaController.criarDisciplina);

// DELETE /disciplinas/:id
router.delete('/:id', disciplinaController.deletarDisciplina);

module.exports = router;
