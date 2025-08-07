// academic-hub/config/db.js

const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Esta linha lê a sua string de conexão do arquivo .env
    const conn = await mongoose.connect(process.env.MONGO_URI, {});
    
    // Se a conexão for bem-sucedida, esta mensagem aparecerá no terminal
    console.log(`MongoDB Conectado: ${conn.connection.host}`);
  } catch (err) {
    // Se a conexão falhar, esta mensagem de erro aparecerá
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;