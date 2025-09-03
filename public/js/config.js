(async function(){
  try {
    const res = await fetch('/api/config');
    if (!res.ok) {
      alert('Erro ao carregar configurações iniciais');
      return;
    }
    let cfg;
    try {
      cfg = await res.json();
    } catch (err) {
      console.error('Erro ao processar configurações', err);
      alert('Resposta inválida do servidor de configurações');
      return;
    }
    window.APP_CONFIG = cfg;
    window.SYNCPAY_CONFIG = window.SYNCPAY_CONFIG || {};
    window.SYNCPAY_CONFIG.client_id = cfg.syncpay?.clientId;
    window.SYNCPAY_CONFIG.client_secret = cfg.syncpay?.clientSecret;
    window.SYNCPAY_CONFIG.plans = cfg.plans || {};
    window.PUSHINPAY_CONFIG = cfg.pushinpay || {};

    document.title = `Privacy | Checkout ${cfg.model.name}`;
    document.querySelectorAll('[data-config="model.name"]').forEach(el => el.textContent = cfg.model.name);
    document.querySelectorAll('[data-config="model.handle"]').forEach(el => el.textContent = cfg.model.handle);
    document.querySelectorAll('[data-config="model.bio"]').forEach(el => el.textContent = cfg.model.bio);

    if (cfg.plans) {
      Object.keys(cfg.plans).forEach(key => {
        const plan = cfg.plans[key];
        const labelEl = document.querySelector(`[data-config="plans.${key}.label"]`);
        const priceEl = document.querySelector(`[data-config="plans.${key}.priceLabel"]`);
        if (labelEl) labelEl.textContent = plan.label;
        if (priceEl) priceEl.textContent = plan.priceLabel;
      });
    }
  } catch (err) {
    console.error('Erro ao carregar configurações', err);
    alert('Erro ao carregar configurações');
  }
})();
