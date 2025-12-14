const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }, // select: false para não retornar a password 
  role: { type: String,  enum: ['cliente', 'tecnico', 'admin'], default: 'cliente'} // ex: "cliente", "tecnico", "admin"
});

userSchema.pre('save',  async function() {
  //  lógica para converter em hash a password antes de guardar
  if (!this.isModified('password')) {
    return next();
  }
  this.password= await bcrypt.hash(this.password,10);
  next();
});

//comparar password no login
userSchema.methods.isValidPassword= async function(password){
  const compare= await bcrypt.compare(password,this.password);
  return compare;
};

module.exports = mongoose.model("User", userSchema);
