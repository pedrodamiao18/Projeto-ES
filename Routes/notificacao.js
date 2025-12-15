const express = require('express');
const router = express.Router();
const Notificacao = require('../Models/Notificacao');
const verifyJwt = require('../Middleware/auth').verifyJwt;

router.get('/', verifyJwt, async (req, res) => {
  try {
    if (req.user.role !== 'tecnico') {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    const { lida } = req.query;
    const filtros = { id_tecnico: req.user.id };

    if (lida === 'true') {
      filtros.lida = true;
    } else if (lida === 'false' || typeof lida === 'undefined') {
      filtros.lida = false;
    }

    const notificacoes = await Notificacao.find(filtros).populate('id_incidente');

    res.json(notificacoes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao carregar notificações' });
  }
});

module.exports = router;
