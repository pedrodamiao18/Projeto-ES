const mongoose = require("mongoose");

const incidenteSchema = new mongoose.Schema({
  id_cliente: { type: mongoose.Schema.Types.ObjectId, required: true},
  id_tecnico: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  prioridade: { type: String, enum: ['Baixa', 'Media', 'Alta', 'Urgente'], default: null },
  estado: { type: String, enum: ['Em Resolucao', 'Nao Resolvido', 'Resolvido'],
  default: 'Em Resolucao'},
  descricao: { type: String, required: true },
  data: { type: Date, default: Date.now },
  tipoIncidente: { type: String, required: true },
  categoria: {type: String, required: true},
  nome: {type: String, required: true},
  relatorioResolucao: { 
    type: String, select: false, default: null},
  observacoesTecnicas: { 
    type: String, default: ""},
  dataResolucao: {type: Date, default: null} 
  },{
  toJSON: {virtuals: true},
  toObject: {virtuals:true}
});

incidenteSchema.virtual('tempoResolucao').get(function() {
  if (!this.dataResolucao || !this.data) return null;

  const diffMs = this.dataResolucao - this.data;

  const diffHoras = diffMs / (1000 * 60 * 60);
  
  return diffHoras.toFixed(2);
});

module.exports = mongoose.model("Incidente", incidenteSchema);
