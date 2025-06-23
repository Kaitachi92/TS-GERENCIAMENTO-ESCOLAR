const express = require('express');
const router = express.Router();
const mensalidadeController = require('../controllers/mensalidadeController');

// GET /mensalidades
router.get('/', mensalidadeController.listarMensalidades);

module.exports = router;
