const NodeCache = require('node-cache');

const store = new NodeCache({ stdTTL: 0, checkperiod: 0 });
const DEFAULT_CONFIG = {
  gateway: 'syncpay',
  environment: 'production',
  generateQRCodeOnMobile: false,
  syncpay: {},
  pushinpay: {},
  webhook: { baseUrl: 'https://seu-dominio.com', secret: '' },
  model: { name: '', handle: '', bio: '' },
  plans: {},
  redirectUrl: ''
};

function getConfig() {
  let cfg = store.get('config');
  if (!cfg) {
    cfg = { ...DEFAULT_CONFIG };
    store.set('config', cfg);
  }
  return cfg;
}

function saveConfig(newConfig) {
  store.set('config', newConfig);
}

module.exports = { getConfig, saveConfig };
