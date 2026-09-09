const express = require('express');
const router = express.Router();
const frotaController = require('../controllers/frotaController');

router.get('/', frotaController.listar);
router.get('/:id', frotaController.buscarDetalhes);
router.post('/', frotaController.registrar);
router.patch('/:id', frotaController.atualizarTelemetria); // Recomendado: PATCH para atualizações parciais
router.delete('/:id', frotaController.remover);

module.exports = router;