const mongoose = require("mongoose");

const incidenteSchema = new mongoose.Schema({
  id_cliente: { type: Number, required: true },
  id_tecnico: { type: Number },
  estado: { type: String, required: true },
  descricao: { type: String, required: true },
  data: { type: Date, required: true },
  tipoIncidente: { type: String, required: true }
});

module.exports = mongoose.model("Incidente", incidenteSchema);
