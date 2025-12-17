const express = require('express');
const router = express.Router();
const Incidente = require('../Models/Incidente');
const Notificacao = require('../Models/Notificacao');
const { verifyJwt, authorizeRole } = require('../Middleware/auth');

// Admin vê todos os incidentes registados (com filtro opcional por estado)
router.get('/incidentes', verifyJwt,async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Acesso negado' });
        }
      const { estado } = req.query;
      const filtros = {};

      if (estado) {
        filtros.estado = estado;
      }

      const incidentes = await Incidente.find(filtros);
      res.json(incidentes);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao carregar incidentes' });
    }
  }
);

// Admin vê todas as notificações dos técnicos
router.get('/notificacoes',verifyJwt, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Acesso negado' });
        }
      const { lida } = req.query;
      const filtros = {};

      if (lida === 'true') {
        filtros.lida = true;
      } else if (lida === 'false') {
        filtros.lida = false;
      }

      const notificacoes = await Notificacao.find(filtros)
        .populate('id_incidente')
        .populate('id_tecnico', 'name email');

      res.json(notificacoes);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao carregar notificações' });
    }
  }
);

module.exports = router;
