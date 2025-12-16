const express = require('express');
const router = express.Router();
const { resolverIncidente } = require('../Controllers/incidentes'); // O teu controller
const { verifyJwt, authorizeRole } = require('../Middleware/auth'); // Onde guardaste essas funções

router.post(
  '/resolver', 
  verifyJwt, 
  authorizeRole('tecnico'), 
  resolverIncidente
);

module.exports = router;