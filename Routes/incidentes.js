const express = require('express');
const router = express.Router();
const Incidente = require('../Models/Incidente');

// Criar novo incidente
router.post('/', async (req, res) => {
  try {
    const incidente = new Incidente(req.body);
    await incidente.save();
    res.status(201).json({ message: 'Incidente registado com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao registar o incidente.' });
  }
});


// GET - buscar todos os incidentes
router.get('/', async (req, res) => {
  try {
    const {estado} = req.query;
    const filtros = estado ? { estado } : {};
    const incidentes = await Incidente.find(filtros);
    res.json(incidentes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar incidentes.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const incidente = await Incidente.findById(req.params.id);

    if (!incidente) {
      return res.status(404).json({ message: 'Incidente não encontrado' });
    }

    res.json(incidente);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar incidente' });
  }
});

router.put('/:id', async (req, res) => {
  const { nome, descricao, categoria, tipoIncidente,data } = req.body;

  const incidente = await Incidente.findByIdAndUpdate(
    req.params.id,
    { nome, descricao, categoria, tipoIncidente,data },
    { new: true }
  );

  res.json(incidente);
});





module.exports = router;
