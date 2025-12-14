const mongoose = require("mongoose");
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }, // select: false para não retornar a password 
  role: { type: String, required: true}, // ex: "cliente", "tecnico", "admin"
  email: { type: String, required: true, unique: true },
});

userSchema.pre('save',  async function(next) {
  //  lógica para converter em hash a password antes de guardar
  this.password= awaitbcrypt.hash(this.password,10);
  next();
});

//comparar password no login
userSchema.methods.isValidPassword= async function(password){
  const user=this;
  const compare= await bcrypt.compare(password,user.password);
  return compare;
};

module.exports = mongoose.model("User", userSchema);
