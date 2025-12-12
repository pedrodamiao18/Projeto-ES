const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  id_cliente: {type: Number, required: true},
  id_tecnico: {type: Number},
  estado: {type: String, required},
  descricao: {type: String, required},
  data: {type: String, required},
  tipoIncidente: {type: String, required}
});

module.exports = mongoose.model("Incidentes", UserSchema);
