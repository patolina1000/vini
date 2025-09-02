const { getConfig, successResponse, errorResponse, corsResponse, isOptionsRequest } = require('./utils');

exports.handler = async (event, context) => {
    // Tratar requisições CORS preflight
    if (isOptionsRequest(event)) {
        return corsResponse();
    }

    try {
        // Apenas permitir requisições GET
        if (event.httpMethod !== 'GET') {
            return errorResponse('Método não permitido', 405);
        }

        const cfg = getConfig();
        
        const publicConfig = {
            model: cfg.model,
            plans: cfg.plans,
            gateway: cfg.gateway,
            syncpay: cfg.syncpay,
            pushinpay: cfg.pushinpay,
            redirectUrl: cfg.redirectUrl,
            generateQRCodeOnMobile: cfg.generateQRCodeOnMobile
        };

        return successResponse(publicConfig);
    } catch (error) {
        console.error('[Config] Erro ao obter configuração:', error);
        return errorResponse('Erro ao obter configuração', 500, error);
    }
};
