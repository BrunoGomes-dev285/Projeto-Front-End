// src/config/seed.js
const db = require('./database');

const categorias = [
  { tipo: "Ônibus", modelo: "Bus" }, { tipo: "Caminhão", modelo: "Truck" },
  { tipo: "Moto", modelo: "Bike" }, { tipo: "Carro", modelo: "Sedan" },
  { tipo: "Caminhonete", modelo: "Pickup" }, { tipo: "Van", modelo: "Van" },
  { tipo: "SUV", modelo: "SUV" }, { tipo: "Esportivo", modelo: "Sport" },
  { tipo: "Trator", modelo: "Tractor" }, { tipo: "Ambulância", modelo: "Ambulance" }
];

function gerarCoordenada(base, variancia) {
  return (base + (Math.random() * variancia - variancia / 2)).toFixed(4);
}

db.serialize(() => {
  console.log("Iniciando geração de carga de Big Data. Aguarde...");
  db.run("BEGIN TRANSACTION");

  const stmt = db.prepare('INSERT OR REPLACE INTO frota (id, modelo, tipo, vel, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)');
  let count = 1;
  const volumePorCategoria = 10000;

  categorias.forEach(cat => {
    for (let i = 0; i < volumePorCategoria; i++) {
      const id = `V-${count.toString().padStart(6, '0')}`;
      const vel = Math.floor(Math.random() * 120).toString();
      const lat = gerarCoordenada(-14.23, 30);
      const lng = gerarCoordenada(-51.92, 30);

      stmt.run([id, cat.modelo, cat.tipo, vel, lat, lng]);
      count++;
    }
  });

  stmt.finalize();

  db.run("COMMIT", () => {
    console.log(`Sucesso! ${count - 1} veículos foram inseridos no banco de dados.`);
    db.close();
  });
});