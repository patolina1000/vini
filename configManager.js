const readline = require('readline');
const { getConfig, saveConfig } = require('./loadConfig');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ask(question, defaultValue) {
  return new Promise(resolve => {
    rl.question(`${question} (${defaultValue}): `, answer => {
      resolve(answer.trim() === '' ? defaultValue : answer.trim());
    });
  });
}

async function main() {
  const cfg = getConfig();

  cfg.gateway = await ask('Gateway (syncpay/pushinpay)', cfg.gateway);
  cfg.environment = await ask('Environment (production/sandbox)', cfg.environment);
  const defaultMobileQR = cfg.generateQRCodeOnMobile ? 'true' : 'false';
  cfg.generateQRCodeOnMobile = (await ask('Generate QR Code on mobile? (true/false)', defaultMobileQR)).toLowerCase() === 'true';
  // Credenciais sensíveis são definidas via variáveis de ambiente

  cfg.webhook = cfg.webhook || { baseUrl: 'https://seu-dominio.com', secret: '' };
  cfg.webhook.baseUrl = await ask('Webhook base URL', cfg.webhook.baseUrl);

  cfg.redirectUrl = await ask('Redirect URL', cfg.redirectUrl || 'https://www.youtube.com/watch?v=KWiSv44OYI0&list=RDKWiSv44OYI0&start_radio=1');

  cfg.model.name = await ask('Model name', cfg.model.name);
  cfg.model.handle = await ask('Model @', cfg.model.handle);
  cfg.model.bio = await ask('Model bio', cfg.model.bio);

  for (const key of Object.keys(cfg.plans)) {
    const plan = cfg.plans[key];
    plan.label = await ask(`Plan ${key} label`, plan.label);
    plan.priceLabel = await ask(`Plan ${key} price label`, plan.priceLabel);
    plan.price = parseFloat(await ask(`Plan ${key} amount`, plan.price));
  }

  saveConfig(cfg);
  console.log('Configuration saved to app-config.json');
  rl.close();
}

main();
