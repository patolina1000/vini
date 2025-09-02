const { successResponse, errorResponse, corsResponse, isOptionsRequest, parseBody, parsePath } = require('./utils');
const { getPaymentController } = require('../../controller');

exports.handler = async (event, context) => {
    // Tratar requisições CORS preflight
    if (isOptionsRequest(event)) {
        return corsResponse();
    }

    try {
        const { httpMethod } = event;
        const body = parseBody(event);
        const pathParams = parsePath(event);
        const paymentController = getPaymentController();

        switch (httpMethod) {
            case 'GET':
                if (event.path.includes('/info')) {
                    // Informações do gateway ativo
                    const info = paymentController.getGatewayInfo();
                    return successResponse(info);
                } else if (event.path.includes('/test')) {
                    // Testar conectividade
                    const result = await paymentController.testConnection();
                    return successResponse({
                        message: result.message,
                        gateway: paymentController.getGatewayInfo().gateway
                    });
                } else if (event.path.includes('/payment') && event.path.includes('/status')) {
                    // Consultar status de pagamento
                    const { id } = pathParams;
                    if (!id) {
                        return errorResponse('ID do pagamento é obrigatório', 400);
                    }

                    const status = await paymentController.getPaymentStatus(id);
                    return successResponse({
                        data: status,
                        gateway: paymentController.getGatewayInfo().gateway
                    });
                }
                break;

            case 'POST':
                if (event.path.includes('/pix/payment')) {
                    // Criar pagamento PIX via controller
                    const payment = await paymentController.createPixPayment(body);
                    return successResponse({
                        data: payment,
                        gateway: paymentController.getGatewayInfo().gateway
                    });
                } else if (event.path.includes('/refresh-token')) {
                    // Forçar renovação de token
                    await paymentController.refreshToken();
                    return successResponse({
                        message: 'Token renovado com sucesso',
                        gateway: paymentController.getGatewayInfo().gateway
                    });
                }
                break;

            default:
                return errorResponse('Método não permitido', 405);
        }
    } catch (error) {
        console.error('[Controller] Erro no controller:', error.message);
        return errorResponse('Erro no controller', 500, error.message);
    }
};
