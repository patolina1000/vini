const axios = require('axios');

let tokenCache = { access_token: null, expires_at: null };

async function getToken() {
  const now = Date.now();
  if (
    tokenCache.access_token &&
    tokenCache.expires_at &&
    now < tokenCache.expires_at
  ) {
    return tokenCache.access_token;
  }

  try {
    console.log('🔐 [authService] Obtendo novo token...');

    const authData = {
      client_id: process.env.SYNCPAY_CLIENT_ID || '',
      client_secret: process.env.SYNCPAY_CLIENT_SECRET || '',
      '01K1259MAXE0TNRXV2C2WQN2MV': 'auth_service_' + Date.now()
    };

    const { data } = await axios.post(
      'https://api.syncpayments.com.br/api/partner/v1/auth-token',
      authData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    console.log('✅ [authService] Token obtido com sucesso');

    tokenCache = {
      access_token: data.access_token,
      expires_at: new Date(data.expires_at).getTime()
    };

    return tokenCache.access_token;
  } catch (error) {
    console.error(
      '[authService] Erro ao autenticar:',
      error.response?.status,
      error.response?.data || error.message
    );
    throw new Error(`Falha ao autenticar com a API SyncPayments: ${error.response?.status || error.message}`);
  }
}

module.exports = { getToken };
