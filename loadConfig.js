const fs = require('fs');
const path = require('path');

// Carrega variáveis de ambiente de um arquivo .env, se disponível
require('dotenv').config();

const configPath = path.join(__dirname, 'app-config.json');

function getConfig() {
  const data = fs.readFileSync(configPath, 'utf-8');
  return JSON.parse(data);
}

function saveConfig(newConfig) {
  fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2));
}

module.exports = { getConfig, saveConfig, configPath };
