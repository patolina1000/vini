const { successResponse, corsResponse, isOptionsRequest } = require('./utils');
const PaymentGateway = require('../../paymentGateway');
const { getPaymentController } = require('../../controller');
const { getConfig } = require('../../loadConfig');

exports.handler = async (event, context) => {
    // Tratar requisições CORS preflight
    if (isOptionsRequest(event)) {
        return corsResponse();
    }

    try {
        // Apenas permitir requisições GET
        if (event.httpMethod !== 'GET') {
            return {
                statusCode: 405,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Método não permitido' })
            };
        }

        const cfg = getConfig();
        const paymentGateway = new PaymentGateway(cfg.ACTIVE_GATEWAY);
        const paymentController = getPaymentController();

        return successResponse({
            status: 'OK',
            message: 'Servidor funcionando corretamente',
            currentGateway: paymentGateway.getCurrentGateway(),
            controllerGateway: paymentController.getGatewayInfo().gateway
        });
    } catch (error) {
        console.error('[Health] Erro no health check:', error.message);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                status: 'ERROR',
                message: 'Erro no servidor',
                error: error.message
            })
        };
    }
};
