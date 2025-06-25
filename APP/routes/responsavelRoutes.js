const express = require('express');
const router = express.Router();
const responsavelController = require('../controllers/responsavelController');

// GET /responsaveis
router.get('/', responsavelController.listarResponsaveis);
// GET /responsaveis/:id
router.get('/:id', responsavelController.buscarResponsavelPorId);
// POST /responsaveis
router.post('/', responsavelController.criarResponsavel);
// PUT /responsaveis/:id
router.put('/:id', responsavelController.atualizarResponsavel);
// DELETE /responsaveis/:id
router.delete('/:id', responsavelController.excluirResponsavel);

module.exports = router;
