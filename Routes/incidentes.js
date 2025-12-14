const express = require('express');
const router = express.Router();
const Incidente = require('../Models/Incidente');
const verifyJwt = require('../Middleware/auth').verifyJwt;

// Criar novo incidente
router.post('/', verifyJwt, async (req, res) => {
  try {
    const incidente = new Incidente({ ...req.body, id_cliente: req.user.id });
    await incidente.save();
    res.status(201).json({ message: 'Incidente registado com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao registar o incidente.' });
  }
});


// GET - buscar todos os incidentes
router.get('/', verifyJwt, async (req, res) => {
  try {
    const {estado} = req.query;
    const filtros = {id_cliente: req.user.id //só incidentes do cliente autenticado
    };

    if (estado) {
      filtros.estado = estado;
    }
    const incidentes = await Incidente.find(filtros);
    res.json(incidentes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar incidentes.' });
  }
});

router.get('/:id', verifyJwt, async (req, res) => {
  try {
    const incidente = await Incidente.findOne({ _id: req.params.id, id_cliente: req.user.id
  });

    if (!incidente) {
      return res.status(404).json({ message: 'Incidente não encontrado' });
    }

    res.json(incidente);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar incidente' });
  }
});

router.put('/:id', verifyJwt, async (req, res) => {
  const { nome, descricao, categoria, tipoIncidente,data } = req.body;

   const incidente = await Incidente.findOneAndUpdate(
      {_id: req.params.id, id_cliente: req.user.id },
      { nome, descricao, categoria, tipoIncidente, data },
      { new: true }
    );

    if (!incidente) {
      return res.status(404).json({ message: 'Incidente não encontrado' });
    }

  res.json(incidente);
});





module.exports = router;
