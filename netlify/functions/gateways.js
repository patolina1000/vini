const { successResponse, errorResponse, corsResponse, isOptionsRequest, parseBody } = require('./utils');
const PaymentGateway = require('../../paymentGateway');
const { getConfig } = require('../../loadConfig');

exports.handler = async (event, context) => {
    // Tratar requisições CORS preflight
    if (isOptionsRequest(event)) {
        return corsResponse();
    }

    try {
        const { httpMethod } = event;
        const body = parseBody(event);
        const cfg = getConfig();
        const paymentGateway = new PaymentGateway(cfg.gateway);

        switch (httpMethod) {
            case 'GET':
                // Verificar se é uma consulta específica
                if (event.path.includes('/current')) {
                    // Obter gateway atual
                    return successResponse({
                        gateway: paymentGateway.getCurrentGateway()
                    });
                } else if (event.path.includes('/test')) {
                    // Testar configuração dos gateways
                    const gateways = paymentGateway.getAvailableGateways();
                    const currentGateway = paymentGateway.getCurrentGateway();

                    return successResponse({
                        message: 'Configuração dos gateways',
                        current_gateway: currentGateway,
                        gateways: gateways,
                        config_status: {
                            pushinpay_token: process.env.PUSHINPAY_TOKEN ? 'Configurado' : 'Não configurado',
                            pushinpay_environment: process.env.PUSHINPAY_ENVIRONMENT || cfg.environment || 'production',
                            syncpay_client_id: process.env.SYNCPAY_CLIENT_ID ? 'Configurado' : 'Não configurado',
                            syncpay_client_secret: process.env.SYNCPAY_CLIENT_SECRET ? 'Configurado' : 'Não configurado'
                        }
                    });
                } else {
                    // Listar gateways disponíveis
                    const gateways = paymentGateway.getAvailableGateways();
                    return successResponse({
                        gateways: gateways,
                        current: paymentGateway.getCurrentGateway()
                    });
                }

            case 'POST':
                // Alterar gateway
                if (event.path.includes('/switch')) {
                    const { gateway } = body;
                    
                    if (!gateway) {
                        return errorResponse('Gateway deve ser especificado', 400);
                    }

                    paymentGateway.setGateway(gateway);
                    
                    return successResponse({
                        message: `Gateway alterado para ${gateway}`,
                        current: paymentGateway.getCurrentGateway()
                    });
                }
                break;

            default:
                return errorResponse('Método não permitido', 405);
        }
    } catch (error) {
        console.error('[Gateways] Erro ao gerenciar gateways:', error.message);
        return errorResponse('Erro ao gerenciar gateways', 500, error.message);
    }
};
