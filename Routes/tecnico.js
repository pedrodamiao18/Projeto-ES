const express = require("express");
const axios = require("axios");
const router = express.Router();
const verificarTokenJWT = require("../Middleware/auth").verifyJwt;
const verificarTecnico = require("../Middleware/roles").isTecnico;

router.get("/incidentes/:id_tecnico", verificarTokenJWT, verificarTecnico, async (req, res) => {
  try {
    const { id_tecnico } = req.params;
    const resposta = await axios.get(`http://localhost:3000/incidentes/${id_tecnico}`);
    res.json(resposta.data);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao obter dados da Customer API para o cliente." });
  }
});