//vai ser para guardar variaveis sensiveis num ficheiro .env
//o ficheiro .env nao deve ser posto to git
require('dotenv').config();
const express = require("express");
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
//const mongoose = require('mongoose'); MongoDB e Mongoose

//MIDDLEWARE
// Servir ficheiros estáticos da pasta 'public' (HTML, CSS, JS, imagens)
app.use(express.static(path.join(__dirname, 'public')));
//impede o browser de bloquear pedidos entre o frontend e o backend
app.use(cors());
//faz parse do json que vem no body do pedido
//apenas se usarmos Content-Type : application/json
app.use(express.json());

// Página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor a correr em http://localhost:${PORT}`);
});
