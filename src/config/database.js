// src/config/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, '../../noc_bigdata.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Erro ao conectar ao banco de dados:', err.message);
  else console.log('Conexão estabelecida com o SQLite.');
});

db.run(`CREATE TABLE IF NOT EXISTS frota (
  id TEXT PRIMARY KEY,
  modelo TEXT,
  tipo TEXT,
  vel TEXT,
  latitude TEXT,
  longitude TEXT,
  ultima_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

module.exports = db;