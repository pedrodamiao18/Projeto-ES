const express = require("express");
const axios = require("axios");
const router = express.Router();
const verificarTokenJWT = require("../middleware/auth");

router.get("/incidentes/:id_tecnico", verificarTokenJWT, async (req, res) => {
  try {
    const { id_tecnico } = req.params;
    const resposta = await axios.get(`http://localhost:3000/incidentes/${id_tecnico}`);
    res.json(resposta.data);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao obter dados da Customer API para o cliente." });
  }
});