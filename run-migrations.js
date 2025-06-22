const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const migrationsDir = path.join(__dirname, 'migrations');

// Lê e ordena os arquivos numericamente
const files = fs.readdirSync(migrationsDir)
  .filter(f => f.endsWith('.js'))
  .sort();

// Exemplo de objeto pgm fake para rodar localmente (substitua pelo real se necessário)
const pgm = {
  // Adicione métodos fake ou reais conforme seu ambiente
  createTable: (...args) => console.log('createTable', ...args),
  dropTable: (...args) => console.log('dropTable', ...args),
};

(async () => {
  for (const file of files) {
    const migration = require(path.join(migrationsDir, file));
    if (typeof migration.up === 'function') {
      console.log(`Executando migration: ${file}`);
      await migration.up(pgm);
      continue;
    }
    if (typeof migration.handle === 'function') {
      console.log(`Executando handle: ${file}`);
      await migration.handle();
      continue;
    }
    if (typeof migration.execute === 'function') {
      console.log(`Executando execute: ${file}`);
      await migration.execute();
      continue;
    }
    console.log(`Arquivo ${file} não possui função up/handle/execute exportada.`);
  }

  // Executa todas as migrations reais usando node-pg-migrate
  try {
    execSync('npx node-pg-migrate up', { stdio: 'inherit' });
    console.log('Todas as migrations aplicadas com sucesso!');
  } catch (err) {
    console.error('Erro ao rodar as migrations:', err);
    process.exit(1);
  }
})();
