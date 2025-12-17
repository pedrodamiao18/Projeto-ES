const express = require('express');
const router = express.Router();
const Notificacao = require('../Models/Notificacao');
const verifyJwt = require('../Middleware/auth').verifyJwt;

router.get('/', verifyJwt, async (req, res) => {
  try {
    if (!['tecnico', 'cliente'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    const { lida } = req.query;
    const filtros = {
      id_utilizador: req.user.id,
      destinatario_tipo: req.user.role
    };

    if (lida === 'true') {
      filtros.lida = true;
    } else if (lida === 'false' || typeof lida === 'undefined') {
      filtros.lida = false;
    }

    const notificacoes = await Notificacao
      .find(filtros)
      .sort({ data_criacao: -1 })
      .populate('id_incidente');

    res.json(notificacoes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao carregar notificações' });
  }
});

router.patch('/:id/lida', verifyJwt, async (req, res) => {
  try {
    if (!['tecnico', 'cliente'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    const notificacao = await Notificacao.findOneAndUpdate(
      {
        _id: req.params.id,
        id_utilizador: req.user.id,
        destinatario_tipo: req.user.role
      },
      { lida: true },
      { new: true }
    );

    if (!notificacao) {
      return res.status(404).json({ message: 'Notificação não encontrada' });
    }

    res.json({ message: 'Notificação marcada como lida', notificacao });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao atualizar notificação' });
  }
});

module.exports = router;
