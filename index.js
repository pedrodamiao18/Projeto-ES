require('dotenv').config();
const express = require("express");
const path = require('path');
const cors = require('cors');
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoutes = require('./Routes/auth');
const incidentesRoutes = require('./Routes/incidentes');
const estatisticasRoutes = require('./Routes/estatisticas');

const { verifyJwt } = require('./Middleware/auth');
const { isAdministrador } = require('./Middleware/roles');

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
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'autenticacao', 'login.html'));
});



app.use('/auth', authRoutes);
app.use('/api/incidentes', incidentesRoutes);

// Rotas protegidas (necessitam de autenticação)
app.use('/api/estatisticas', verifyJwt, isAdministrador, estatisticasRoutes);

const notificacoesRoutes = require('./Routes/notificacao');
app.use('/notificacoes', notificacoesRoutes);

const incidentesTecnicoRoutes = require('./Routes/incidentes_tecnico');
app.use('/incidentes-tecnico', incidentesTecnicoRoutes);

const adminRoutes = require('./Routes/admin');
app.use('/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor a correr em: http://localhost:${PORT}`);
});
