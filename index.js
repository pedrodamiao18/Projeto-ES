require('dotenv').config();
const express = require("express");
const path = require('path');
const cors = require('cors');
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT;

const authRoutes = require('./Routes/auth');

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Rotas
const incidentesRouter = require('./Routes/incidentes');
app.use('/api/incidentes', incidentesRouter);


app.listen(PORT, () => {
  console.log(`Servidor a correr em http://localhost:${PORT}`);
});
