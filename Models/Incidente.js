const mongoose = require("mongoose");

const incidenteSchema = new mongoose.Schema({
  id_cliente: { type: mongoose.Schema.Types.ObjectId, required: true},
  id_tecnico: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  prioridade: { type: String, enum: ['Baixa', 'Media', 'Alta', 'Urgente'], default: null },
  estado: { type: String, enum: ['Por iniciar', 'Aberto', 'Resolvido'],
  default: 'Por iniciar'},
  descricao: { type: String, required: true },
  data: { type: Date, default: Date.now },
  tipoIncidente: { type: String, required: true },
  categoria: {type: String, required: true},
  nome: {type: String, required: true}
});

module.exports = mongoose.model("Incidente", incidenteSchema);
