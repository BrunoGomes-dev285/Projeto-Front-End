const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = 3000;
app.use(cors()); app.use(express.json());
const db = new sqlite3.Database('./backend/noc_database.sqlite');
app.get('/api/dados', (req, res) => {
  const payload = { infraestrutura: [], frota: [], noc: {} };
  db.all('SELECT * FROM infraestrutura WHERE id > 0', [], (err, rowsInfra) => {
    if (err) return res.status(500).json({ error: err.message }); payload.infraestrutura = rowsInfra;
    db.get('SELECT latitude, longitude FROM infraestrutura WHERE id = 0', [], (errNoc, rowNoc) => {
      if (!errNoc && rowNoc) payload.noc = rowNoc;
      db.all('SELECT * FROM frota', [], (errFrota, rowsFrota) => { if (errFrota) return res.status(500).json({ error: errFrota.message }); payload.frota = rowsFrota; res.json(payload); });
    });
  });
});
app.put('/api/telemetria/:id', (req, res) => {
  const { id } = req.params; const { latitude, longitude, vel } = req.body;
  db.run('UPDATE frota SET latitude = ?, longitude = ?, vel = ?, ultima_atualizacao = CURRENT_TIMESTAMP WHERE id = ?', [latitude, longitude, vel, id], function (err) { if (err) return res.status(500).json({ error: err.message }); res.json({ message: 'Coordenadas do veículo atualizadas no SQL!', linhasAfetadas: this.changes }); });
});
app.listen(port, () => console.log(`API do NOC rodando na porta ${port}`));
