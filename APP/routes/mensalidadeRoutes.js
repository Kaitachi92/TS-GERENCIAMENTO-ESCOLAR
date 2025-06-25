const express = require('express');
const router = express.Router();
const mensalidadeController = require('../controllers/mensalidadeController');

// GET /mensalidades
router.get('/', mensalidadeController.listarMensalidades);
// POST /mensalidades
router.post('/', mensalidadeController.criarMensalidade);
// PUT /mensalidades/:id
router.put('/:id', mensalidadeController.atualizarMensalidade);
// DELETE /mensalidades/:id
router.delete('/:id', mensalidadeController.deletarMensalidade);

module.exports = router;
