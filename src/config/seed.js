const db = require('./database');

const categorias = [
  { tipo: "Ônibus", modelo: "🚌" }, { tipo: "Caminhão", modelo: "🚚" },
  { tipo: "Moto", modelo: "🏍" }, { tipo: "Carro", modelo: "🚗" },
  { tipo: "Caminhonete", modelo: "🛻" }, { tipo: "Van", modelo: "🚐" },
  { tipo: "SUV", modelo: "🚙" }, { tipo: "Esportivo", modelo: "🏎" },
  { tipo: "Trator", modelo: "🚜" }, { tipo: "Ambulância", modelo: "🚑" }
];

// Retorna Number em vez de String
function gerarCoordenada(base, variancia) {
  return Number((base + (Math.random() * variancia - variancia / 2)).toFixed(4));
}

db.serialize(() => {
  console.log("Iniciando geração de carga de Big Data. Aguarde...");

  db.run("BEGIN TRANSACTION");

  const stmt = db.prepare(`INSERT OR REPLACE INTO frota (id, modelo, tipo, vel, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)`);
  let count = 1;
  const volumePorCategoria = 10000;

  categorias.forEach(cat => {
    for (let i = 0; i < volumePorCategoria; i++) {
      const id = `V-${count.toString().padStart(6, '0')}`;
      const vel = Math.floor(Math.random() * 120); // Mantido como Number
      const lat = gerarCoordenada(-14.23, 30);      // Mantido como Number
      const lng = gerarCoordenada(-51.92, 30);      // Mantido como Number

      stmt.run([id, cat.modelo, cat.tipo, vel, lat, lng]);
      count++;
    }
  });

  stmt.finalize();

  db.run("COMMIT", (err) => {
    if (err) {
      console.error("Erro ao finalizar transação:", err.message);
    } else {
      console.log(`Sucesso! ${count - 1} veículos foram inseridos no banco de dados.`);
    }
    db.close();
  });
});