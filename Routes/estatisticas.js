const express = require("express");
const router = express.Router();
const Incidente = require("../Models/Incidente");

// GET /api/estatisticas (apenas para administradores)
router.get("/", async (req, res) => {
  try {
    const totalIncidentes = await Incidente.countDocuments();

    const estadosPadrao = ["Por iniciar", "Aberto", "Resolvido"];
    const incidentesPorEstadoDocs = await Incidente.aggregate([
      { $group: { _id: "$estado", count: { $sum: 1 } } },
    ]);

    const incidentesPorEstado = estadosPadrao.reduce((acc, estado) => {
      acc[estado] = 0;
      return acc;
    }, {});

    incidentesPorEstadoDocs.forEach((estado) => {
      incidentesPorEstado[estado._id] = estado.count;
    });

    res.json({
      total: totalIncidentes,
      incidentesPorEstado,
    });
  } catch (err) {
    console.error("Erro ao obter estatísticas:", err);
    res.status(500).json({ erro: "Erro ao obter estatísticas" });
  }
});

module.exports = router;
