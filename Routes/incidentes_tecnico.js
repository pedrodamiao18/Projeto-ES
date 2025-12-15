const express = require('express');
const router = express.Router();
const Incidente = require('../Models/Incidente');
const Notificacao = require('../Models/Notificacao');
const verifyJwt = require('../Middleware/auth').verifyJwt;

//ver todos os incidentes disponivesis sem tecncos atribuidos
router.get('/disponiveis', verifyJwt, async (req, res) => {
  if (req.user.role !== 'tecnico') {
    return res.status(403).json({ message: 'Acesso negado' });
  }

  const incidentes = await Incidente.find({ id_tecnico: null });
  res.json(incidentes);
});
// incidentes atribuídos ao técnico autenticado
router.get('/meus', verifyJwt, async (req, res) => {
  try {
    if (req.user.role !== 'tecnico') {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    const incidentes = await Incidente.find({ id_tecnico: req.user.id });
    res.json(incidentes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao carregar incidentes' });
  }
});

// aceitar incidente + definir prioridade
router.post('/aceitar', verifyJwt, async (req, res) => {
  try {
    if (req.user.role !== 'tecnico') {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    const { id_incidente, incidente_id, prioridade } = req.body;
    const incidenteId = id_incidente || incidente_id;

    if (!prioridade) {
      return res.status(400).json({ message: 'Prioridade é obrigatória' });
    }
    if (!incidenteId) {
      return res.status(400).json({ message: 'Incidente inválido' });
    }

    const incidente = await Incidente.findOneAndUpdate(
      {
        _id: incidenteId,
        id_tecnico: null   // garante que ainda não foi aceite
      },
      {
        id_tecnico: req.user.id,
        prioridade,
        estado: 'Por iniciar'
      },
      { new: true }
    );

    if (!incidente) {
      return res.status(400).json({
        message: 'Incidente já foi aceite por outro técnico'
      });
    }

    await Notificacao.updateMany(
      { id_incidente: incidente._id },
      { lida: true }
    );

    res.json({
      message: 'Incidente aceite com sucesso',
      incidente
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao aceitar incidente' });
  }
});
// alterar estado do incidente
router.put('/estado/:id', verifyJwt, async (req, res) => {
  try {
    if (req.user.role !== 'tecnico') {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    const { estado } = req.body;

    const estadosValidos = ['Por iniciar', 'Aberto', 'Resolvido'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ message: 'Estado inválido' });
    }

    const incidente = await Incidente.findOneAndUpdate(
      {
        _id: req.params.id,
        id_tecnico: req.user.id   //só o técnico responsável
      },
      { estado },
      { new: true }
    );

    if (!incidente) {
      return res.status(404).json({ message: 'Incidente não encontrado' });
    }

    res.json({
      message: 'Estado atualizado',
      incidente
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao atualizar estado' });
  }
});
module.exports = router;
