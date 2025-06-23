const express = require('express');
const router = express.Router();
const turmaController = require('../controllers/turmaController');

router.get('/', turmaController.listarTurmas);
router.post('/', turmaController.criarTurma);
router.get('/:id', turmaController.buscarTurma);
router.put('/:id', turmaController.atualizarTurma);
router.delete('/:id', turmaController.deletarTurma);

module.exports = router;
