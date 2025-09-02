const { successResponse, errorResponse, corsResponse, isOptionsRequest, parseBody, parsePath, parseQuery } = require('./utils');
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
        const pathParams = parsePath(event);
        const queryParams = parseQuery(event);
        const cfg = getConfig();
        const paymentGateway = new PaymentGateway(cfg.ACTIVE_GATEWAY);

        switch (httpMethod) {
            case 'GET':
                if (event.path.includes('/status')) {
                    // Consultar status do pagamento
                    const { paymentId } = pathParams;
                    if (!paymentId) {
                        return errorResponse('ID do pagamento é obrigatório', 400);
                    }

                    const statusResult = await paymentGateway.getPaymentStatus(paymentId);
                    return successResponse({
                        message: 'Status do pagamento consultado com sucesso',
                        gateway: paymentGateway.getCurrentGateway(),
                        data: statusResult
                    });
                } else {
                    // Listar pagamentos
                    const filters = queryParams;
                    const paymentsResult = await paymentGateway.listPayments(filters);
                    
                    return successResponse({
                        message: 'Pagamentos listados com sucesso',
                        gateway: paymentGateway.getCurrentGateway(),
                        data: paymentsResult
                    });
                }

            case 'POST':
                if (event.path.includes('/pix/create')) {
                    // Criar pagamento PIX
                    try {
                        paymentGateway.validatePaymentData(body);
                        const paymentResult = await paymentGateway.createPixPayment(body);
                        
                        return successResponse({
                            message: 'Pagamento PIX criado com sucesso',
                            gateway: paymentGateway.getCurrentGateway(),
                            data: paymentResult
                        });
                    } catch (error) {
                        return errorResponse('Erro ao criar pagamento PIX', error.response?.status || 500, error.response?.data || error.message);
                    }
                }
                break;

            default:
                return errorResponse('Método não permitido', 405);
        }
    } catch (error) {
        console.error('[Payments] Erro ao gerenciar pagamentos:', error.message);
        return errorResponse('Erro ao gerenciar pagamentos', 500, error.message);
    }
};
