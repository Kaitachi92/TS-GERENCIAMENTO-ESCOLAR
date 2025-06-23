const express = require('express');
const router = express.Router();
const responsavelController = require('../controllers/responsavelController');

// GET /responsaveis
router.get('/', responsavelController.listarResponsaveis);

module.exports = router;
