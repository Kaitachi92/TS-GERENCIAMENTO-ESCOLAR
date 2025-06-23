const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/alunoController');

router.get('/', alunoController.listarAlunos);
router.post('/', alunoController.criarAluno);
router.get('/:id', alunoController.buscarAluno);
router.put('/:id', alunoController.atualizarAluno);
router.delete('/:id', alunoController.deletarAluno);

module.exports = router;
