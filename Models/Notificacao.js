const mongoose = require("mongoose");

const NotificacaoSchema = new mongoose.Schema({
  id_incidente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Incidente',
    required: true
  },
  id_tecnico: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mensagem: { type: String, required: true },
  lida: { type: Boolean, default: false },
  data_criacao: { type: Date, default: Date.now }
});
module.exports = mongoose.model("Notificacao", NotificacaoSchema);
