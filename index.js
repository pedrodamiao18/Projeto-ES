require('dotenv').config();
const express = require("express");
const path = require('path');
const cors = require('cors');
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT;

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  credentials: true,
  origin: 'http://localhost:4000'
}));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Rotas
const authRoutes = require('./Routes/auth');
app.use('/auth', authRoutes);

const incidentesRouter = require('./Routes/incidentes');
app.use('/api/incidentes', incidentesRouter);

const notificacoesRoutes = require('./Routes/notificacao');
app.use('/notificacoes', notificacoesRoutes);

const incidentesTecnicoRoutes = require('./Routes/incidentes_tecnico');
app.use('/incidentes-tecnico', incidentesTecnicoRoutes);

const adminRoutes = require('./Routes/admin');
app.use('/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`Servidor a correr em http://localhost:${PORT}`);
});
