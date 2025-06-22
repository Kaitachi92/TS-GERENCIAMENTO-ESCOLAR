const fs = require('fs');
const path = require('path');
const pool = require('./config/pg');

const seedsDir = path.join(__dirname, 'seeds');

if (!fs.existsSync(seedsDir)) {
  console.log('Diretório de seeds não encontrado. Crie a pasta APP/seeds e adicione seus arquivos.');
  process.exit(0);
}

const files = fs.readdirSync(seedsDir)
  .filter(f => f.endsWith('.js'))
  .sort();

(async () => {
  for (const file of files) {
    const seed = require(path.join(seedsDir, file));
    if (typeof seed.handle === 'function') {
      console.log(`Executando seed: ${file}`);
      await seed.handle(pool);
    } else if (typeof seed.execute === 'function') {
      console.log(`Executando execute: ${file}`);
      await seed.execute(pool);
    } else {
      console.log(`Arquivo ${file} não possui função handle/execute exportada.`);
    }
  }
  await pool.end();
  console.log('Seeds finalizados!');
})();
