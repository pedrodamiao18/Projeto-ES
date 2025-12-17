const express = require('express');
const router = express.Router();
const { resolverIncidente, listarIncidentesTecnico } = require('../Controllers/solucao');
const { verifyJwt, authorizeRole } = require('../Middleware/auth');

router.get(
  '/', 
  verifyJwt, 
  authorizeRole('tecnico'), 
  listarIncidentesTecnico
);

router.post(
  '/', 
  verifyJwt, 
  authorizeRole('tecnico'), 
  resolverIncidente
);

module.exports = router;