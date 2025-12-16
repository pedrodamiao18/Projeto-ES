require('dotenv').config();
const express = require("express");
const path = require('path');
const cors = require('cors');
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 4000;


app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  credentials: true,
  origin: 'http://localhost:4000'
}));
app.use(express.json());
app.use(cookieParser());


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado"))
  .catch((err) => console.error("❌ Erro ao conectar ao MongoDB:", err));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

const authRoutes = require('./Routes/auth');
const incidentesRoutes = require('./Routes/incidentes');
const estatisticasRoutes = require('./Routes/estatisticas');

const { verifyJwt } = require('./Middleware/auth');
const { isAdministrador } = require('./Middleware/roles');

app.use('/auth', authRoutes);
app.use('/api/incidentes', incidentesRoutes);

// Rotas protegidas (necessitam de autenticação)
app.use('/api/estatisticas', verifyJwt, isAdministrador, estatisticasRoutes);

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor a correr em: http://localhost:${PORT}`);
});
